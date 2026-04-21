import { ref, watch, type Ref } from 'vue'
import { getSdk, type ArtworkQuery } from '../generated/graphql'
import { client } from '../lib/graphql'

export type ArtworkDetail = NonNullable<ArtworkQuery['artwork']>

const sdk = getSdk(client)

export function useArtwork(slug: Ref<string>) {
  const data = ref<ArtworkDetail | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function load(id: string) {
    loading.value = true
    error.value = null
    try {
      const response = await sdk.Artwork({ id })
      data.value = response.artwork ?? null
    } catch (err) {
      error.value = err as Error
    } finally {
      loading.value = false
    }
  }

  watch(slug, load, { immediate: true })

  return { data, loading, error }
}
