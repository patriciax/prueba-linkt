<script setup>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ref } from 'vue'
const model = defineModel()
const props = defineProps({
  label: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    required: true
  },
  error: {
    type: String,
    default: ''
  },
  isRequired: {
    type: Boolean
  }
})

const toolbarOptions = ref([
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote'],
  ['link'],

  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
  [{ indent: '-1' }, { indent: '+1' }],

  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }]
])
</script>

<template>
  <div class="relative">
    <p
      class="text-sm font-medium mb-0.5 text-default-text"
      :class="{ 'text-red-500': props.error }"
    >
      {{ props.label }} <span v-if="isRequired" class="text-red-500">*</span>
    </p>
    <QuillEditor
      theme="snow"
      v-model:content="model"
      content-type="html"
      :toolbar="toolbarOptions"
    />
    <p class="absolute right-0 mt-0.5 text-xs font-medium text-red-500" v-if="props.error">
      {{ props.error }}
    </p>
  </div>
</template>
