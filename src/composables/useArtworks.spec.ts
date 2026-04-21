import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { flushPromises } from '@vue/test-utils'

const mockArtworks = vi.fn()
const mockSearchArtworks = vi.fn()

vi.mock('../generated/graphql', () => ({
  getSdk: () => ({
    Artworks: mockArtworks,
    SearchArtworks: mockSearchArtworks,
  }),
}))

const { useArtworks } = await import('./useArtworks')

describe('useArtworks', () => {
  beforeEach(() => {
    mockArtworks.mockReset()
    mockSearchArtworks.mockReset()
  })

  it('fetches the list when the query is empty', async () => {
    mockArtworks.mockResolvedValue({
      artworksConnection: {
        edges: [
          { node: { internalID: '1', title: 'A', slug: 'a', artistNames: 'X', image: null } },
        ],
      },
    })
    const query = ref('')
    const { data, loading, error } = useArtworks(query)
    await flushPromises()
    expect(mockArtworks).toHaveBeenCalledWith({ first: 24 })
    expect(mockSearchArtworks).not.toHaveBeenCalled()
    expect(data.value).toHaveLength(1)
    expect(data.value[0].title).toBe('A')
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('fetches search results when the query is set', async () => {
    mockSearchArtworks.mockResolvedValue({
      searchConnection: {
        edges: [
          {
            node: {
              __typename: 'Artwork',
              internalID: '2',
              title: 'B',
              slug: 'b',
              artistNames: 'Y',
              image: null,
            },
          },
        ],
      },
    })
    const query = ref('picasso')
    const { data } = useArtworks(query)
    await flushPromises()
    expect(mockSearchArtworks).toHaveBeenCalledWith({ query: 'picasso', first: 24 })
    expect(mockArtworks).not.toHaveBeenCalled()
    expect(data.value).toHaveLength(1)
    expect(data.value[0].title).toBe('B')
  })

  it('drops non-Artwork search results', async () => {
    mockSearchArtworks.mockResolvedValue({
      searchConnection: {
        edges: [
          { node: { __typename: 'Artist' } },
          {
            node: {
              __typename: 'Artwork',
              internalID: '2',
              title: 'Keep me',
              slug: 'b',
              artistNames: 'Y',
              image: null,
            },
          },
        ],
      },
    })
    const { data } = useArtworks(ref('x'))
    await flushPromises()
    expect(data.value).toHaveLength(1)
    expect(data.value[0].title).toBe('Keep me')
  })

  it('captures errors and clears loading', async () => {
    mockArtworks.mockRejectedValue(new Error('boom'))
    const { error, loading } = useArtworks(ref(''))
    await flushPromises()
    expect(error.value).toEqual(new Error('boom'))
    expect(loading.value).toBe(false)
  })
})
