import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchBar from './SearchBar.vue'

describe('SearchBar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes the input with initialValue', () => {
    const wrapper = mount(SearchBar, { props: { initialValue: 'monet' } })
    expect(wrapper.get('input').element.value).toBe('monet')
  })

  it('emits update:query after the debounce window', async () => {
    const wrapper = mount(SearchBar)
    await wrapper.get('input').setValue('picasso')
    expect(wrapper.emitted('update:query')).toBeUndefined()
    vi.advanceTimersByTime(350)
    expect(wrapper.emitted('update:query')).toEqual([['picasso']])
  })

  it('only emits the latest value when typing quickly', async () => {
    const wrapper = mount(SearchBar)
    const input = wrapper.get('input')
    await input.setValue('p')
    vi.advanceTimersByTime(100)
    await input.setValue('pi')
    vi.advanceTimersByTime(100)
    await input.setValue('picasso')
    vi.advanceTimersByTime(350)
    expect(wrapper.emitted('update:query')).toEqual([['picasso']])
  })
})
