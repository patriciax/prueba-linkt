<script setup>
import { computed } from 'vue'

const colorBtn = {
  disabled: 'bg-gray-300 text-gray-500  cursor-not-allowed',
  primary:
    'bg-violet-600 text-white font-bold p-4 rounded-xl text-md font-semibold leading-6 shadow-sm   hover:bg-opacity-90 flex gap-1 items-center justify-center group relative mx-auto',
  secondary:
    'border border-gray-500 text-gray-500 font-bold p-4 rounded-xl text-md font-semibold leading-6 shadow-sm   hover:bg-gray-100 flex gap-1 items-center justify-center group relative ',
  red: 'bg-red-600 text-white font-bold p-4 rounded-xl text-md font-semibold leading-6 shadow-sm   hover:bg-opacity-90 flex gap-1 items-center justify-center group relative ',
  tertiary:
    'bg-white text-gray-900 border  border-dashed w-full border-gray-400 font-bold h-16 rounded-xl text-md font-semibold leading-6 shadow-sm   hover:bg-gray-100 flex gap-1 items-center justify-center group relative '
}

const sizeBtn = {
  medium: 'px-3 py-2 rounded-md text-sm'
}

const props = defineProps({
  text: {
    default: '',
    type: String
  },
  isFull: {
    default: false,
    type: Boolean
  },
  isDisabled: {
    default: false,
    type: Boolean
  },
  isLoading: {
    default: false,
    type: Boolean
  },
  color: {
    default: 'primary',
    type: String
  },
  size: {
    default: 'medium',
    type: String
  },
  withIcon: {
    default: false,
    type: Boolean
  },
  isTooltip: {
    default: false,
    type: Boolean
  },
  type: {
    default: 'submit',
    type: String
  },
  position: {
    type: String
  }
})

const classBtn = computed(() => {
  const _styles = [sizeBtn[props.size]]
  _styles.push(props.isDisabled ? colorBtn.disabled : colorBtn[props.color])
  _styles.push(props.isFull ? 'w-full' : ' max-w-max')
  return _styles.join(' ')
})
</script>

<template>
  <button :class="classBtn" :disabled="props.isDisabled || props.isLoading" :type="props.type">
    <template v-if="props.isLoading">
      <span class="loadingBtn" v-text="$t('COMMON.LOADING')" />
    </template>
    <template v-else-if="$slots.content">
      <slot name="content" />
    </template>
    <template v-else-if="props.withIcon">
      <slot name="icon" />
      <slot />
      <template v-if="props.isTooltip">
        <div class="absolute -bottom-8 hidden w-max group-hover:block" :class="props.position">
          <div class="mx-auto -mb-1 h-2 w-2 rotate-45 bg-gray-700"></div>
          <p class="rounded-md bg-gray-700 px-4 py-1 text-xs text-white" v-text="props.text" />
        </div>
      </template>
      <template v-else>
        {{ props.text }}
      </template>
    </template>
    <template v-else>
      {{ props.text }}
    </template>
  </button>
</template>
