<script setup>
import Dropdown from '@/components/common/Dropdown.vue'
import useProjectStore from '@/stores/projects'
import { ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

const emit = defineEmits(['search', 'searchStatus', 'resetList'])
const props = defineProps({
  type: {
    type: String,
    default: 'search'
  }
})
const projectStore = useProjectStore()
const status = ref('')
const search = ref(null)
const openSearch = ref(false)
const inputSearch = ref('')
const errorMsg = ref('')
const statusLists = ref([
  {
    name: 'Pendiente',
    value: 'border-gray-500'
  },
  {
    name: 'En progreso',
    value: 'border-yellow-500'
  },
  {
    name: 'Completada',
    value: 'border-green-500'
  }
])
const selectedStatus = (value, _closeDropdown) => {
  status.value = value
  emit('searchStatus', status.value)

  _closeDropdown()
}

const openSearchAction = () => {
  openSearch.value = !openSearch.value
  search.value.focus()
}

const searchProject = () => {
  if (inputSearch.value === '') {
    errorMsg.value = 'Ingresa un texto'
    return
  }
  emit('search', inputSearch.value)
  errorMsg.value = ''
}

const resetSearch = (_closeDropdown) => {
  status.value = ''
  projectStore.resetFilter()
  _closeDropdown()
  emit('resetList')
}

const handleClose = () => {
  openSearch.value = false
  inputSearch.value = ''
  errorMsg.value = ''
  projectStore.reset()
}
</script>

<template>
  <div v-if="props.type === 'search'">
    <div class="flex items-center relative">
      <button
        @click="openSearchAction"
        type="button"
        :disabled="openSearch"
        :class="{ 'hover:bg-gray-200': !openSearch }"
        class="flex items-center focus:outline-none gap-1 z-10 px-2 h-8 rounded-lg"
      >
        <MagnifyingGlassIcon class="w-4 h-4" />
        <p v-show="!openSearch" v-text="'Buscar'" />
      </button>
      <input
        v-model="inputSearch"
        ref="search"
        :class="openSearch ? ' md:w-full w-full xl:w-64 ' : 'w-0 opacity-0'"
        class="rounded-md border pl-8 transition-all focus:outline-none -ml-9 border-gray-200 p-2 text-sm"
        type="text"
        @keyup.enter="searchProject"
      />
      <button
        class="focus:outline-none -ml-6 mr-2"
        v-show="openSearch"
        @click="handleClose"
        type="button"
      >
        <XMarkIcon class="w-4 h-4 text-black" />
      </button>
      <button
        class="focus:outline-none ml-2 text-sm bg-violet-600 text-white px-2 h-8 rounded-md"
        v-show="openSearch"
        @click="searchProject"
        type="button"
      >
        <MagnifyingGlassIcon class="w-4 h-4" />
      </button>
    </div>
    <p v-if="errorMsg" class="text-red-500 text-xs absolute">{{ errorMsg }}</p>
  </div>
  <div v-else>
    <Dropdown styles="w-full left-0">
      <template v-slot:trigger="{ openDropdown, isOpen }">
        <button
          type="button"
          class="flex items-center border w-[132px] h-8 focus:bg-gray-200 hover:bg-gray-200 px-2 py-1.5 rounded-lg"
          @click="openDropdown"
        >
          <span class="mr-1 text-sm text-black border-r pr-2">
            {{ status ? status : 'Filtrar estado' }}</span
          >
          <ChevronDownIcon
            class="hidden lg:block text-gray transition-all w-4 h-4 text-black ease-in-out"
            :class="{ 'rotate-180': isOpen }"
          />
        </button>
      </template>
      <template v-slot:content="{ closeDropdown }">
        <section class="py-2 w-full">
          <button
            type="button"
            class="flex items-center text-sm hover:bg-gray-100 w-full p-2 rounded-md"
            v-for="item in statusLists"
            :key="item.name"
            @click="selectedStatus(item.name, closeDropdown)"
          >
            <div :class="` ${item.value}`" class="border-2 h-[14px] w-[14px] mr-2 rounded-full" />
            {{ item.name }}
          </button>
          <p
            @click="resetSearch(closeDropdown)"
            class="text-sm mt-2 border-t pt-2 text-center text-gray-600"
            v-text="'Borrar busqueda'"
          ></p>
        </section>
      </template>
    </Dropdown>
  </div>
</template>
