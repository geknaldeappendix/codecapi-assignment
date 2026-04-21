import { ref, watch, type Ref } from 'vue'
import { getSdk, type ArtworksQuery } from '../generated/graphql'
import { client } from '../lib/graphql'

type ArtworksConnection = NonNullable<ArtworksQuery['artworksConnection']>
type ArtworksEdge = NonNullable<NonNullable<ArtworksConnection['edges']>[number]>
export type Artwork = NonNullable<ArtworksEdge['node']>

const sdk = getSdk(client)

export function useArtworks(query: Ref<string>) {
  const data = ref<Artwork[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function load(q: string) {
    loading.value = true
    error.value = null
    try {
      if (q.trim() === '') {
        const response = await sdk.Artworks({ first: 24 })
        const edges = response.artworksConnection?.edges ?? []
        data.value = edges.flatMap((edge) => (edge?.node ? [edge.node] : []))
      } else {
        const response = await sdk.SearchArtworks({ query: q, first: 24 })
        const edges = response.searchConnection?.edges ?? []
        data.value = edges.flatMap((edge) => {
          const node = edge?.node
          return node && node.__typename === 'Artwork' ? [node] : []
        })
      }
    } catch (err) {
      error.value = err as Error
    } finally {
      loading.value = false
    }
  }

  watch(query, load, { immediate: true })

  return { data, loading, error }
}
