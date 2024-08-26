<script setup>
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Object
  }
})
const status = computed(() => {
  if (props.data.status === 'Pendiente') {
    return 'bg-gray-400'
  }
  if (props.data.status === 'En progreso') {
    return 'bg-yellow-500'
  }
  if (props.data.status === 'Completada') {
    return 'bg-green-500'
  }
  return 'bg-gray-500'
})
</script>
<template>
  <div
    class="bg-white cursor-pointer shadow rounded-lg mt-3 flex relative z-30 col-span-2 lg:col-span-1"
  >
    <div :class="status" class="w-2.5 p-1 h-auto rounded-tl-md rounded-bl-md"></div>
    <div class="w-full p-8">
      <div class="md:flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold mb-2 leading-6 text-gray-800">{{ props.data.name }}</h2>
          <p class="text-sm text-left text-gray-500">{{ props.data.status }}</p>
        </div>
        <div class="text-2xl md:mt-0 mt-4 font-semibold leading-6 text-gray-800">
          <button class="hover:text-violet-500 text-gray-600 mr-3" @click="$emit('editTask')">
            <PencilSquareIcon class="w-5 h-5" />
          </button>
          <button class="hover:text-red-500 text-gray-600" @click="$emit('deleteTask')">
            <TrashIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
      <p
        class="text-base max-h-20 w-full overflow-auto mt-4 text-gray-600"
        v-html="props.data.description"
      />
    </div>
  </div>
</template>
