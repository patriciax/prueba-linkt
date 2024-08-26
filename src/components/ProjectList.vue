<script setup>
import { computed } from 'vue'

const emit = defineEmits(['edit'])
const props = defineProps({
  data: {
    type: Object
  }
})
const formattedDate = computed(() => {
  const date = new Date(props.data.time)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}`
})
</script>
<template>
  <div
    @click="emit('edit')"
    class="py-5 border-b px-3 transition hover:bg-indigo-100 cursor-pointer"
  >
    <div href="#" class="flex justify-between items-center">
      <h3 class="text-lg font-semibold capitalize">{{ props.data.name }}</h3>
      <p v-if="props.data.time" class="text-md text-gray-400">{{ formattedDate }}</p>
    </div>
    <div class="text-md italic text-gray-400 truncate">{{ props.data.description }}</div>
  </div>
</template>
