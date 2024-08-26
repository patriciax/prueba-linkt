<script setup>
import Button from '@/components/common/Btn.vue'
import TaskForm from '@/components/forms/Task.vue'
import DeleteTaskModal from '@/components/modals/Confirm.vue'
import useProjectStore from '@/stores/projects'
import { BriefcaseIcon, PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { computed, onMounted, ref, watch } from 'vue'
import Filter from './common/Filter.vue'
import Modal from './common/Modal.vue'
import TaskList from './TaskList.vue'

const $emit = defineEmits(['editProject', 'deleteProject', 'addTask'])
const projectStore = useProjectStore()

const props = defineProps({
  data: {
    type: Object
  }
})
const projectIdTask = ref(null)
const projectId = ref(null)
const addTaskModal = ref(false)
const openModaledit = ref(false)
const taskId = ref(null)
const deleteModalTask = ref(false)

const formattedColor = computed(() => {
  if (props.data.color) {
    const parts = props.data.color.split('-')
    if (parts.length > 1) {
      return `text-${parts[1]}-500`
    }
  }
  return 'text-violet-500'
})

const addTaskOpen = (id) => {
  projectIdTask.value = id
  addTaskModal.value = true
}

const editTask = (value) => {
  projectStore.setCurrentTask(value)

  taskId.value = value.projectId
  openModaledit.value = true
}

const deleteTask = (_task_id, _project_id) => {
  deleteModalTask.value = true
  taskId.value = _task_id
  projectId.value = _project_id
}
const confirmDeleteTask = () => {
  projectStore.deleteTask(+taskId.value, +projectId.value)
  deleteModalTask.value = false
}

onMounted(() => {
  projectStore.getTaskStatus(props.data.id)
})

watch(
  () => projectStore.currentProject,
  (newVal) => {
    if (newVal) {
      projectStore.getTaskStatus(props.data.id)
    }
  }
)

const statusColor = (status) => {
  if (status === 'Pendiente') {
    return 'bg-gray-400'
  }
  if (status === 'En progreso') {
    return 'bg-yellow-500'
  }
  if (status === 'Completada') {
    return 'bg-green-500'
  }
  return 'bg-gray-500'
}
</script>

<template>
  <div class="flex justify-between items-center h-44 border-b-2 mb-4">
    <div class="flex space-x-4 items-start">
      <div
        :class="props.data.color ? props.data.color : 'text-violet-500'"
        class="rounded-full border-2 p-2 mr-2 hidden lg:block"
      >
        <BriefcaseIcon :class="formattedColor" class="w-4 h-4" />
      </div>
      <div class="flex flex-col">
        <h3 class="font-semibold text-lg">{{ props.data.name }}</h3>
        <p class="text-light text-gray-400 mb-2">{{ props.data.description }}</p>

        <section class="flex items-center gap-4">
          <ul class="flex lg:flex-row flex-col gap-2 lg:gap-6">
            <li
              :class="statusColor(status)"
              class="px-2 rounded-lg text-white font-semibold text-xs py-1"
              v-for="(count, status) in projectStore.taskCounts"
              :key="status"
            >
              {{ status }}:( {{ count }} )
            </li>
          </ul>
        </section>
      </div>
    </div>
    <div>
      <ul class="flex text-gray-400 space-x-4">
        <button class="hover:text-violet-500" @click="$emit('editProject')">
          <PencilSquareIcon class="w-6 h-6" />
        </button>
        <button class="hover:text-red-500" @click="$emit('deleteProject', props.data.id)">
          <TrashIcon class="w-6 h-6" />
        </button>
      </ul>
    </div>
  </div>
  <section>
    <section class="flex items-center justify-between mb-4">
      <p class="font-bold text-2xl mb-6">Tareas</p>
      <Filter type="filter" @searchStatus="projectStore.filter(null, $event, props.data.id)" />
    </section>
    <div class="mb-4">
      <Button color="tertiary" is-full withIcon @click="addTaskOpen(props.data.id)">
        <template #icon>
          <PlusIcon class="w-5 h-5" />
        </template>
        Agregar nueva tarea
      </Button>
    </div>
    <section class="mt-8 text-gray-500 leading-7 gap-6 grid grid-cols-2">
      <template v-if="projectStore.filteredTasks.length">
        <p
          class="text-center col-span-2 bg-gray-100 rounded-lg p-4"
          v-text="'No se encontraron tareas para este estado'"
          v-if="!projectStore.filteredTasks.length"
        />
        <TaskList :data="task" v-for="task in projectStore.filteredTasks" :key="task.id" />
      </template>
      <template v-else>
        <p
          class="text-center col-span-2 bg-gray-100 rounded-lg p-4"
          v-text="'No se encontraron tareas'"
          v-if="!props.data.tasks.length"
        />
        <TaskList
          @editTask="editTask(task)"
          :data="task"
          @deleteTask="deleteTask(task.id, task.projectId)"
          v-for="task in props.data.tasks"
          :key="task.id"
        />
      </template>
    </section>
  </section>

  <Modal v-if="addTaskModal" @close="addTaskModal = false" size="w-[600px]">
    <TaskForm :projectId="projectIdTask" @close="addTaskModal = false" />
  </Modal>
  <Modal v-if="openModaledit" @close="openModaledit = false" size="w-[600px]">
    <TaskForm :is-edit="true" :project-id="taskId" @close="openModaledit = false" />
  </Modal>

  <DeleteTaskModal
    title="¿Estas Seguro que quieres eliminar la tarea?"
    @close="deleteModalTask = false"
    v-if="deleteModalTask"
    @delete="confirmDeleteTask"
  />
</template>
