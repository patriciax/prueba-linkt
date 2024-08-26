<script setup>
import Modal from '@/components/common/Modal.vue'
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import Btn from '../common/Btn.vue'

const props = defineProps({
  title: {
    type: String
  },
  content: {
    type: String
  }
})
</script>
<template>
  <Modal @close="$emit('close')">
    <div class="mb-6">
      <ExclamationCircleIcon class="w-12 text-orange-500 mx-auto" />
      <p class="text-xl font-semibold text-center mb-4" v-text="props.title" />
      <p class="text-sm text-center text-gray-500" v-text="props.content" />
    </div>
    <div class="flex gap-2 justify-center">
      <Btn text="Cancelar" color="secondary" @click="$emit('close')" />
      <Btn text="Eliminar" color="red" @click="$emit('delete')" />
    </div>
  </Modal>
</template>
