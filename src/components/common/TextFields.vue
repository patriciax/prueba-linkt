<script setup lang="ts">
const props = defineProps({
  id: {
    type: String
  },
  modelValue: {
    type: [String, Number]
  },
  placeholder: {
    type: String,
    default: ''
  },
  name: {
    type: String
  },
  type: {
    default: 'text'
  },
  isDisabled: {
    type: Boolean
  },
  errorMessage: {
    type: [String, Boolean]
  },
  label: {
    type: String
  },
  isRequired: {
    type: Boolean
  }
})

const emit = defineEmits(['update:modelValue'])
const handleInput = (_event) => emit('update:modelValue', _event.target.value)
</script>
<template>
  <section class="relative">
    <label v-show="props.label">
      <span
        :class="{ 'text-red-500': props.errorMessage }"
        class="text-sm font-medium"
        v-text="props.label"
      />
      <span v-if="isRequired" class="text-red-500">*</span>

      <input
        :id="props.id"
        :type="props.type"
        class="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none dark:border-gray-700 dark:text-gray-300"
        :class="[
          props.errorMessage ? 'border border-red-500  dark:border-red-500 ' : '',
          isDisabled
            ? 'cursor-not-allowed bg-gray-200 opacity-70 dark:bg-gray-600'
            : 'bg-white dark:bg-gray-600'
        ]"
        :name="props.name"
        :placeholder="props.placeholder"
        :value="props.modelValue"
        :disabled="props.isDisabled"
        autocomplete="off"
        @input="handleInput"
      />

      <p
        v-if="props.errorMessage"
        class="absolute right-0 mt-0.5 text-xs font-medium text-red-500"
        v-text="props.errorMessage"
      />
    </label>
  </section>
</template>
