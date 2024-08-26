<script setup>
import Button from '@/components/common/Btn.vue'
import Filter from '@/components/common/Filter.vue'
import Modal from '@/components/common/Modal.vue'
import ProjectForm from '@/components/forms/Project.vue'
import DeleteProjectModal from '@/components/modals/Confirm.vue'
import ProjectList from '@/components/ProjectList.vue'
import TaskContent from '@/components/TaskContent.vue'
import useProjectStore from '@/stores/projects'
import { BriefcaseIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { onMounted, ref } from 'vue'

const projectStore = useProjectStore()
const addProject = ref(false)
const isEditProject = ref(false)
const deleteModalProject = ref(false)
const projectId = ref(null)

const EditProject = (project) => {
  projectStore.setCurrentProject(project)
  projectStore.resetFilterTasks()
}
const handleCloseProject = () => {
  isEditProject.value = false
  projectStore.reset()
}

const reload = (value) => {
  projectStore.setCurrentProject(value)
}

const deleteProject = (id) => {
  deleteModalProject.value = true
  projectId.value = id
}
const confirmDelete = () => {
  projectStore.deleteProject(+projectId.value)
  projectStore.setCurrentProject(null)
  deleteModalProject.value = false
}

const staticProjects = ref([
  {
    id: 1,
    name: 'Proyecto Predeterminado',
    description: 'Este es un proyecto predeterminado',
    color: 'border-violet-500',
    tasks: [
      {
        id: 1,
        name: 'Nueva tarea',
        description: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>',
        status: 'En progreso',
        projectId: 1
      }
    ],
    time: '2024-08-25T12:34:56.789Z'
  },
  {
    id: 2,
    name: 'Proyecto 2',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    color: 'border-blue-500',
    tasks: [],
    time: '2024-08-25T12:34:56.789Z'
  }
])
onMounted(() => {
  localStorage.setItem('projects', JSON.stringify(staticProjects.value))
})
</script>
<template>
  <main class="flex lg:flex-row flex-col w-full h-full rounded-3xl px-4 lg:px-2 2xl:px-16">
    <section class="flex flex-col lg:w-4/12">
      <div class="mb-4">
        <Button color="tertiary" is-full withIcon @click="addProject = !addProject">
          <template #icon>
            <PlusIcon class="w-5 h-5" />
          </template>
          Agregar nuevo proyecto
        </Button>
      </div>
      <div
        class="bg-gray-50 pb-4 h-[300px] lg:h-full overflow-x-hidden rounded-md transition-all overflow-y-scroll"
      >
        <div
          class="flex items-center justify-between w-full mb-4 sticky px-4 py-2 top-0 bg-slate-100 border-b z-10"
        >
          <Filter @search="projectStore.filter($event, null, null)" />
        </div>
        <p
          class="text-sm font-semibold text-gray-400 px-4 sticky top-[54px] py-2 bg-gray-50"
          v-text="'Proyectos'"
        ></p>

        <section class="h-[10vh] lg:h-[calc(100vh-260px)]">
          <section
            class="text-sm font-semibold flex-col text-gray-400 px-4 py-2 h-full flex items-center justify-center"
            v-if="!projectStore.projects.length > 0"
          >
            <div class="bg-violet-500 rounded-full mb-2 p-2 mr-2">
              <BriefcaseIcon class="text-white w-4 h-4" />
            </div>
            No tiene proyectos
          </section>
          <template v-else>
            <ProjectList
              v-for="(project, index) in projectStore.projects"
              :key="index"
              :data="project"
              @edit="EditProject(project)"
            />
          </template>
        </section>
      </div>
    </section>
    <section class="w-full px-4 lg:pl-10 flex flex-col bg-white rounded-r-3xl">
      <section
        class="text-sm font-semibold flex-col text-gray-400 px-4 py-2 h-full flex items-center justify-center"
        v-if="!projectStore.currentProject"
      >
        <div class="bg-violet-500 rounded-full mb-2 p-2 mr-2">
          <BriefcaseIcon class="text-white w-4 h-4" />
        </div>
        Selecciona un proyecto
      </section>
      <TaskContent
        v-else
        :data="projectStore.currentProject"
        @editProject="isEditProject = !isEditProject"
        @deleteProject="deleteProject"
      />
    </section>
  </main>

  <Modal v-if="addProject" @close="addProject = false" size="w-[400px]">
    <ProjectForm @close="addProject = false" />
  </Modal>

  <Modal v-if="isEditProject" @close="isEditProject = false" size="w-[400px]">
    <ProjectForm :is-edit="isEditProject" @close="handleCloseProject" @reload="reload" />
  </Modal>
  <DeleteProjectModal
    content="Se eliminara las tareas asociadas al proyecto"
    title="¿Estas Seguro que quieres eliminar este proyecto?"
    s
    @close="deleteModalProject = false"
    v-if="deleteModalProject"
    @delete="confirmDelete"
  />
</template>
