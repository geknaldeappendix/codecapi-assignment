import { onScopeDispose, ref, watch, type Ref } from 'vue'
import { getSdk, type ArtworkQuery } from '../generated/graphql'
import { client } from '../lib/graphql'

export type ArtworkDetail = NonNullable<ArtworkQuery['artwork']>

const sdk = getSdk(client)

export function useArtwork(slug: Ref<string>) {
  const data = ref<ArtworkDetail | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  let controller: AbortController | null = null

  async function load(id: string) {
    controller?.abort()
    const current = new AbortController()
    controller = current
    loading.value = true
    error.value = null
    try {
      const response = await sdk.Artwork({ id }, undefined, current.signal)
      if (current.signal.aborted) return
      data.value = response.artwork ?? null
    } catch (err) {
      if (current.signal.aborted) return
      error.value = err as Error
    } finally {
      if (!current.signal.aborted) loading.value = false
    }
  }

  watch(slug, load, { immediate: true })
  onScopeDispose(() => controller?.abort())

  return { data, loading, error }
}
