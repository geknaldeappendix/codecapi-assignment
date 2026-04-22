import { onScopeDispose, ref, watch, type Ref } from 'vue'
import { getSdk, type ArtworksQuery } from '../generated/graphql'
import { client } from '../lib/graphql'

type ArtworksConnection = NonNullable<ArtworksQuery['artworksConnection']>
type ArtworksEdge = NonNullable<NonNullable<ArtworksConnection['edges']>[number]>
export type Artwork = NonNullable<ArtworksEdge['node']>

const sdk = getSdk(client)

const RECENT_KEY = 'artsy-browser:recent-artworks'
const QUERY_KEY = 'artsy-browser:last-query'

function readCache<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export const recentArtworks = ref<Artwork[]>(readCache<Artwork[]>(RECENT_KEY, []))
export const lastQuery = ref(readCache<string>(QUERY_KEY, ''))

export function useArtworks(query: Ref<string>) {
  const data = ref<Artwork[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  let controller: AbortController | null = null

  async function load(q: string) {
    controller?.abort()
    const current = new AbortController()
    controller = current
    loading.value = true
    error.value = null
    try {
      let results: Artwork[]
      if (q.trim() === '') {
        const response = await sdk.Artworks({ first: 24 }, undefined, current.signal)
        const edges = response.artworksConnection?.edges ?? []
        results = edges.flatMap((edge) => (edge?.node ? [edge.node] : []))
      } else {
        const response = await sdk.SearchArtworks({ query: q, first: 24 }, undefined, current.signal)
        const edges = response.searchConnection?.edges ?? []
        results = edges.flatMap((edge) => {
          const node = edge?.node
          return node && node.__typename === 'Artwork' ? [node] : []
        })
      }
      if (current.signal.aborted) return
      data.value = results
      recentArtworks.value = results
      lastQuery.value = q
      sessionStorage.setItem(RECENT_KEY, JSON.stringify(results))
      sessionStorage.setItem(QUERY_KEY, JSON.stringify(q))
    } catch (err) {
      if (current.signal.aborted) return
      error.value = err as Error
    } finally {
      if (!current.signal.aborted) loading.value = false
    }
  }

  watch(query, load, { immediate: true })
  onScopeDispose(() => controller?.abort())

  return { data, loading, error }
}
