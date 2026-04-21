<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useArtwork } from '../composables/useArtwork'
import { recentArtworks, lastQuery } from '../composables/useArtworks'
import StateMessage from '../components/StateMessage.vue'

const props = defineProps<{ slug: string }>()
const { data, loading, error } = useArtwork(toRef(props, 'slug'))

const displaySlug = ref(props.slug)
const direction = ref<'next' | 'prev'>('next')

watch(data, () => {
  const oldIdx = recentArtworks.value.findIndex((a) => a.slug === displaySlug.value)
  const newIdx = recentArtworks.value.findIndex((a) => a.slug === props.slug)
  if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx) {
    direction.value = newIdx > oldIdx ? 'next' : 'prev'
  }
  displaySlug.value = props.slug
})

const carouselName = computed(() => `carousel-${direction.value}`)
const textName = computed(() => `text-${direction.value}`)

const backTo = computed(() => ({
  name: 'browse',
  query: lastQuery.value ? { q: lastQuery.value } : {},
}))

const windowItems = computed(() => {
  const idx = recentArtworks.value.findIndex((a) => a.slug === displaySlug.value)
  if (idx < 0) return []
  return [-1, 0, 1].flatMap((position) => {
    const item = recentArtworks.value[idx + position]
    if (!item) return []
    return [{
      slug: item.slug,
      position,
      src: item.image?.large,
      alt: item.title ?? '',
    }]
  })
})

const positionClasses: Record<number, string> = {
  [-1]: 'pos-prev',
  0: 'pos-current',
  1: 'pos-next',
}

const metadata = computed(() => {
  const d = data.value
  if (!d) return []
  return [
    { label: 'Year', value: d.date },
    { label: 'Medium', value: d.medium },
    { label: 'Dimensions', value: d.dimensions?.cm },
    { label: 'Status', value: d.saleMessage },
  ].filter((row) => row.value)
})

const partners = computed(() =>
  (data.value?.artist?.highlights?.partnersConnection?.edges ?? []).flatMap((edge) =>
    edge?.node ? [edge.node] : [],
  ),
)
</script>

<template>
  <section class="space-y-4">
    <RouterLink :to="backTo" class="text-sm text-gray-600 hover:underline">
      <- Back to browse
    </RouterLink>
    <StateMessage v-if="loading && !data">Loading…</StateMessage>
    <StateMessage v-else-if="error && !data" variant="error">Something went wrong.</StateMessage>
    <StateMessage v-else-if="!data">Artwork not found.</StateMessage>
    <div v-else class="space-y-6">
      <Transition :name="textName" mode="out-in">
        <div :key="`hdr-${displaySlug}`" class="mx-auto flex min-h-16 max-w-2xl items-baseline justify-between gap-6">
          <h2 class="text-2xl font-semibold text-gray-900">{{ data.title || 'Untitled' }}</h2>
          <RouterLink
            v-if="data.artistNames"
            :to="{ name: 'browse', query: { q: data.artistNames } }"
            class="text-gray-600 hover:underline"
          >
            {{ data.artistNames }}
          </RouterLink>
        </div>
      </Transition>

      <div class="relative h-[680px] overflow-hidden">
        <TransitionGroup :name="carouselName" tag="div">
          <RouterLink
            v-for="w in windowItems"
            :key="w.slug"
            :to="{ name: 'artwork', params: { slug: w.slug } }"
            :class="['carousel-item group absolute top-1/2 left-1/2 block', positionClasses[w.position]]"
          >
            <img
              v-if="w.src"
              :src="w.src"
              :alt="w.alt"
              class="h-full w-full object-contain shadow-lg"
            />
            <span
              class="absolute top-full right-0 mt-2 text-xs text-gray-600 transition-opacity duration-500 group-hover:underline"
              :class="w.position === -1 ? 'opacity-100' : 'opacity-0'"
            >
              <- previous
            </span>
            <span
              class="absolute top-full left-0 mt-2 text-xs text-gray-600 transition-opacity duration-500 group-hover:underline"
              :class="w.position === 1 ? 'opacity-100' : 'opacity-0'"
            >
              next ->
            </span>
          </RouterLink>
        </TransitionGroup>
      </div>

      <Transition :name="textName" mode="out-in">
        <div :key="`meta-${displaySlug}`" class="space-y-6">
          <dl class="mx-auto grid max-w-2xl grid-cols-[120px_1fr] gap-y-2 text-sm">
            <template v-for="row in metadata" :key="row.label">
              <dt class="text-gray-500">{{ row.label }}</dt>
              <dd class="text-gray-800">{{ row.value }}</dd>
            </template>
          </dl>
          <p
            v-if="data.description"
            class="mx-auto max-w-2xl whitespace-pre-line text-sm text-gray-800"
          >
            {{ data.description }}
          </p>
          <section v-if="partners.length" class="mx-auto max-w-2xl space-y-3">
            <h3 class="text-sm font-semibold text-gray-900">Represented by</h3>
            <ul class="grid grid-cols-3 gap-4">
              <li
                v-for="partner in partners"
                :key="partner.internalID"
                class="flex items-center gap-3 border border-gray-200 p-3"
              >
                <img
                  v-if="partner.profile?.icon?.url"
                  :src="partner.profile.icon.url"
                  :alt="partner.name ?? ''"
                  class="h-10 w-10 shrink-0 object-contain"
                />
                <div class="min-w-0">
                  <div class="truncate text-sm text-gray-900">{{ partner.name }}</div>
                  <div v-if="partner.cities?.length" class="truncate text-xs text-gray-500">
                    {{ partner.cities.filter(Boolean).join(', ') }}
                  </div>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.carousel-item {
  translate: -50% -50%;
  transition:
    transform 500ms ease,
    width 500ms ease,
    height 500ms ease,
    opacity 500ms ease;
}

.pos-current {
  width: 672px;
  height: 672px;
  opacity: 1;
  z-index: 10;
}

.pos-prev,
.pos-next {
  width: 192px;
  height: 192px;
  opacity: 0.7;
  z-index: 5;
}

.pos-prev {
  transform: translateX(-520px) perspective(800px) rotateY(-30deg);
}

.pos-next {
  transform: translateX(520px) perspective(800px) rotateY(30deg);
}

.text-next-enter-active,
.text-next-leave-active,
.text-prev-enter-active,
.text-prev-leave-active {
  transition:
    opacity 180ms ease,
    filter 180ms ease,
    transform 180ms ease;
}

.text-next-enter-from,
.text-next-leave-to,
.text-prev-enter-from,
.text-prev-leave-to {
  opacity: 0;
  filter: blur(6px);
}

.text-next-enter-from,
.text-prev-leave-to {
  transform: translateX(40px);
}

.text-next-leave-to,
.text-prev-enter-from {
  transform: translateX(-40px);
}

.carousel-next-enter-from,
.carousel-next-leave-to,
.carousel-prev-enter-from,
.carousel-prev-leave-to {
  width: 192px;
  height: 192px;
  opacity: 0;
}

.carousel-next-enter-from {
  transform: translateX(760px) perspective(800px) rotateY(30deg);
}

.carousel-next-leave-to {
  transform: translateX(-760px) perspective(800px) rotateY(-30deg);
}

.carousel-prev-enter-from {
  transform: translateX(-760px) perspective(800px) rotateY(-30deg);
}

.carousel-prev-leave-to {
  transform: translateX(760px) perspective(800px) rotateY(30deg);
}

.carousel-next-leave-active,
.carousel-prev-leave-active {
  position: absolute;
}
</style>
