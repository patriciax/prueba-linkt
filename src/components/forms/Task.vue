<script setup>
import Button from '@/components/common/Btn.vue'
import Dropdown from '@/components/common/Dropdown.vue'
import TextFields from '@/components/common/TextFields.vue'
import { showNotification } from '@/composables/useNotification'
import useProjectStore from '@/stores/projects'
import { ChevronDownIcon, PlusIcon } from '@heroicons/vue/24/outline'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { computed, onMounted, ref, watch } from 'vue'
import TextArea from '../common/TextArea.vue'

const emit = defineEmits(['close'])
const props = defineProps({
  projectId: {
    type: Number
  },

  isEdit: {
    type: Boolean
  }
})

const projectStore = useProjectStore()
const changedProject = ref(null)
const dataForm = ref({
  name: '',
  description: '',
  status: 'Pendiente',
  projectId: props.projectId
})

const handlerValidate = useVuelidate(
  {
    name: {
      required
    },
    description: {
      required
    }
  },
  dataForm
)
const status = ref([
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

const resetForm = () => {
  dataForm.value = {
    name: '',
    description: '',
    status: 'Pendiente'
  }

  handlerValidate.value.$reset()
}

const selectedStatus = (value, _closeDropdown) => {
  dataForm.value.status = value
  _closeDropdown()
}

const sendForm = async () => {
  const _validate = await handlerValidate.value.$validate()
  if (!_validate) return

  const newProjectID = changedProject.value ? changedProject.value : props.projectId
  dataForm.value.projectId = newProjectID

  if (props.isEdit) {
    projectStore.updateTask({ originalProjectId: props.projectId, ...dataForm.value })
    showNotification('Tarea editada', 'success')
    emit('close')
    resetForm()
    return
  }

  projectStore.addTaskToProject({ ...dataForm.value })
  showNotification('Tarea agregada', 'success')
  emit('close')
  resetForm()
}

const openAssignProjectModal = (task, _closeDropdown) => {
  changedProject.value = task
  _closeDropdown()
}
const currentProjectName = computed(() => {
  const newProjectID = changedProject.value ? changedProject.value : props.projectId

  const currentProject = projectStore.projects.find((project) => project.id === newProjectID)
  return currentProject ? currentProject.name : 'Sin proyecto asignado'
})

onMounted(() => {
  if (props.isEdit && projectStore.currentTask) {
    dataForm.value = { ...projectStore.currentTask }
  }
})

watch(
  () => projectStore.currentTask,
  (newVal) => {
    if (props.isEdit) {
      dataForm.value = { ...newVal }
    }
  }
)
</script>
<template>
  <section class="max-w-lg mx-auto">
    <h2 class="text-xl font-bold mb-6">
      {{ props.isEdit ? 'Editar Tarea' : 'Agregar Tarea' }}
    </h2>
    <form @submit.prevent="sendForm">
      <section class="relative">
        <TextFields
          id="naem"
          class="mb-4"
          v-model="dataForm.name"
          isRequired
          :errorMessage="
            handlerValidate?.['name']?.$errors?.length > 0 ? 'Este campo es requerido' : undefined
          "
          name="name"
          placeholder=""
          label="Nombre "
        />
      </section>

      <TextArea
        class="mb-4"
        label="Descripción"
        placeholder="Ingresar descripción"
        v-model="dataForm.description"
        isRequired
        :error="
          handlerValidate?.['description']?.$errors?.length > 0
            ? 'Este campo es requerido'
            : undefined
        "
      />

      <section class="mb-4">
        <label>
          <span
            :class="{ 'text-red-500': props.errorMessage }"
            class="text-sm font-medium"
            v-text="'Estado'"
          />
          <span class="text-red-500">*</span>
        </label>
        <Dropdown styles="w-full left-0">
          <template v-slot:trigger="{ openDropdown, isOpen }">
            <button
              type="button"
              class="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none text-start flex justify-between dark:text-gray-300"
              @click="openDropdown"
            >
              <div class="mr-1 text-sm md:text-base text-black">
                {{ dataForm.status }}
              </div>
              <ChevronDownIcon
                class="hidden lg:block text-gray transition-all w-4 h-4 text-black ease-in-out"
                :class="{ 'text-violet-500': isOpen }"
              />
            </button>
          </template>
          <template v-slot:content="{ closeDropdown }">
            <section class="px-2 py-2 w-full">
              <button
                type="button"
                class="flex items-center text-sm hover:bg-gray-100 w-full p-2 rounded-md"
                v-for="item in status"
                :key="item.name"
                @click="selectedStatus(item.name, closeDropdown)"
              >
                <div
                  :class="` ${item.value}`"
                  class="border-2 h-[14px] w-[14px] mr-2 rounded-full"
                />
                {{ item.name }}
              </button>
            </section>
          </template>
        </Dropdown>
      </section>

      <section class="mb-10">
        <label class="flex items-center">
          <p :class="{ 'text-red-500': props.errorMessage }" class="text-sm font-medium">
            {{ props.isEdit ? 'Cambiar asignación' : 'Asignar proyecto' }}
          </p>
          <span class="text-red-500">*</span>
        </label>
        <Dropdown styles="w-full left-0">
          <template v-slot:trigger="{ openDropdown, isOpen }">
            <button
              type="button"
              class="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none text-start flex justify-between dark:text-gray-300"
              @click="openDropdown"
            >
              <div class="mr-1 text-sm md:text-base text-black">
                {{ currentProjectName }}
              </div>
              <ChevronDownIcon
                class="hidden lg:block text-gray transition-all w-4 h-4 text-black ease-in-out"
                :class="{ 'text-violet-500': isOpen }"
              />
            </button>
          </template>
          <template v-slot:content="{ closeDropdown }">
            <section class="px-2 py-2 w-full">
              <button
                type="button"
                class="flex items-center text-sm hover:bg-gray-100 w-full p-2 rounded-md"
                v-for="(item, index) in projectStore.projects"
                :key="index"
                @click="openAssignProjectModal(item.id, closeDropdown)"
              >
                {{ item.name }}
              </button>
            </section>
          </template>
        </Dropdown>
      </section>

      <Button class="w-full" withIcon>
        <template #icon>
          <PlusIcon v-if="!props.isEdit" class="w-5 h-5" />
        </template>
        {{ props.isEdit ? 'Actualizar' : 'Agregar ' }}
      </Button>
    </form>
  </section>
</template>
