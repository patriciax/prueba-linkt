<script setup>
import Modal from '@/components/common/Modal.vue'
import ProjectForm from '@/components/forms/Project.vue'
import TaskForm from '@/components/forms/Task.vue'
import useProjectStore from '@/stores/projects'
import { onMounted, ref } from 'vue'

const projectStore = useProjectStore()
const isEditProject = ref(false)
const addProject = ref(false)
const addTask = ref(false)
const projectIdTask = ref(null)

onMounted(() => {
  projectStore.getTaskStatusGeneral()
})
</script>
<template>
  <div class="px-20">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 my-10">
      <section
        v-for="(count, status) in projectStore.taskCountGeneral"
        :key="status"
        class="p-6 bg-white border border-gray-200 rounded-lg shadow 0 cursor-pointer mt-3 relative z-30"
      >
        <div>
          <div class="mb-2 text-center font-bold tracking-tight uppercase text-gray-900">
            {{ status }} <br />
            <p
              class="bg-violet-200 mt-1 rounded-full w-10 h-10 flex items-center justify-center mx-auto"
            >
              {{ count }}
            </p>
          </div>
        </div>
      </section>
    </div>

    <section class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-10">
      <p class="text-2xl font-bold col-span-3 border-b">Proyectos</p>
      <div
        v-for="(project, index) in projectStore.projects"
        :key="index"
        class="p-6 bg-white border border-gray-200 rounded-lg shadow 0 cursor-pointer mt-3 relative z-30"
      >
        <div>
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
            {{ project.name }}
          </h5>
        </div>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {{ project.description }}
        </p>
        <button
          @click="(addTask = true), (projectIdTask = project.id)"
          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-violet-500 rounded-lg focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Agregar Tarea
        </button>
      </div>
    </section>
    <section class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <p class="text-2xl font-bold col-span-3 border-b">Tareas</p>
      <div v-for="(project, index) in projectStore.projects" :key="index">
        <section
          v-for="task in project.tasks"
          :key="task.id"
          class="p-6 bg-white border border-gray-200 rounded-lg shadow 0 cursor-pointer mt-3 relative z-30"
        >
          <div>
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
              {{ task.name }}
            </h5>
          </div>
          <p
            class="mb-3 font-normal text-gray-700 dark:text-gray-400"
            v-html="task.description"
          ></p>
        </section>
      </div>
    </section>
    <Modal v-if="addProject" @close="addProject = false">
      <ProjectForm
        :is-edit="isEditProject"
        @close="(isEditProject = false), (addProject = false)"
      />
    </Modal>

    <Modal v-if="addTask" @close="addTask = false">
      <TaskForm :projectId="projectIdTask" @close="addTask = false" />
    </Modal>
  </div>
</template>
