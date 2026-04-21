import { ref } from 'vue'
import { getSdk, type ArtworksQuery } from '../generated/graphql'
import { client } from '../lib/graphql'

type ArtworksConnection = NonNullable<ArtworksQuery['artworksConnection']>
type ArtworksEdge = NonNullable<NonNullable<ArtworksConnection['edges']>[number]>
export type Artwork = NonNullable<ArtworksEdge['node']>

const sdk = getSdk(client)

export function useArtworks() {
  const data = ref<Artwork[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function load() {
    loading.value = true
    error.value = null
    try {
      const response = await sdk.Artworks({ first: 24 })
      const edges = response.artworksConnection?.edges ?? []
      data.value = edges.flatMap((edge) => (edge?.node ? [edge.node] : []))
    } catch (err) {
      error.value = err as Error
    } finally {
      loading.value = false
    }
  }

  load()

  return { data, loading, error }
}
