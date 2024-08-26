import { defineStore } from 'pinia'

export default defineStore({
  id: 'Projects',
  state: () => ({
    _status: null,
    _error: null,
    _projects: JSON.parse(localStorage.getItem('projects')) || [],
    _currentProject: null,
    _currentTask: null,
    _taskCounts: {
      Pendiente: 0,
      'En progreso': 0,
      Completada: 0
    },
    _taskCountsGeneral: { Pendiente: 0, 'En progreso': 0, Completada: 0 },
    _filteredTasks: []
  }),
  getters: {
    isLoading: (state) => state._status === 'loading',
    isReady: (state) => state._status === 'ready',
    isError: (state) => state._status === 'error',
    error: (state) => state._error,
    projects: (state) => state._projects,
    currentProject: (state) => state._currentProject,
    currentTask: (state) => state._currentTask,
    taskCounts: (state) => state._taskCounts,
    taskCountGeneral: (state) => state._taskCountsGeneral,
    filteredTasks: (state) => state._filteredTasks
  },
  actions: {
    addProject(_project) {
      this._status = 'loading'
      const currentDate = new Date().toISOString()

      const newProject = {
        id: this._projects.length + 1,
        ..._project,
        tasks: [],
        time: currentDate
      }
      this._projects.push(newProject)
      localStorage.setItem('projects', JSON.stringify(this._projects))
      this._status = 'ready'
    },
    updateProject(_project) {
      this._status = 'loading'
      const index = this._projects.findIndex((project) => project.id === _project.id)
      if (index !== -1) {
        this._projects[index] = _project
        localStorage.setItem('projects', JSON.stringify(this._projects))
        this._status = 'ready'
      }
    },
    setCurrentProject(_project) {
      this._currentProject = _project
    },
    setCurrentTask(_task) {
      this._currentTask = _task
    },
    deleteProject(_projectId) {
      this._status = 'loading'
      const index = this._projects.findIndex((project) => project.id === _projectId)
      if (index !== -1) {
        this._projects.splice(index, 1)
        localStorage.setItem('projects', JSON.stringify(this._projects))
        this._status = 'ready'
      } else {
        console.error('Proyecto no encontrado:', _projectId)
      }
    },

    addTaskToProject(_task) {
      console.log(_task)
      this._status = 'loading'
      const index = this._projects.findIndex((project) => project.id === _task.projectId)
      if (index !== -1) {
        this._projects[index].tasks.push({ id: this._projects[index].tasks.length + 1, ..._task })
        localStorage.setItem('projects', JSON.stringify(this._projects))
        this._status = 'ready'
      } else {
        console.error('Proyecto no encontrado:', _task.projectId)
      }
    },
    updateTask(_task) {
      this._status = 'loading'
      const originalProjectIndex = this._projects.findIndex(
        (project) => project.id === _task.originalProjectId
      )

      if (originalProjectIndex !== -1) {
        const taskIndex = this._projects[originalProjectIndex].tasks.findIndex(
          (task) => task.id === _task.id
        )
        if (taskIndex !== -1) {
          this._projects[originalProjectIndex].tasks.splice(taskIndex, 1)
        }
      }
      const newProjectIndex = this._projects.findIndex((project) => project.id === _task.projectId)
      if (newProjectIndex !== -1) {
        const updatedTask = { ..._task }
        this._projects[newProjectIndex].tasks.push(updatedTask)
        localStorage.setItem('projects', JSON.stringify(this._projects))
        this._status = 'ready'
      } else {
        console.error('Proyecto no encontrado:', _task.projectId)
      }
    },
    deleteTask(taskId, projectId) {
      console.log(projectId, taskId)
      this._status = 'loading'

      const projectIndex = this._projects.findIndex((project) => project.id === projectId)
      if (projectIndex !== -1) {
        const taskIndex = this._projects[projectIndex].tasks.findIndex((task) => task.id === taskId)
        if (taskIndex !== -1) {
          this._projects[projectIndex].tasks.splice(taskIndex, 1)
          localStorage.setItem('projects', JSON.stringify(this._projects))
          this._status = 'ready'
        } else {
          console.error('Tarea no encontrada:', taskId)
        }
      } else {
        console.error('Proyecto no encontrado:', projectId)
      }
    },
    filter(name = null, status = null, projectId = null) {
      const originalProjects = JSON.parse(localStorage.getItem('projects')) || []

      let filteredProjects = originalProjects

      if (name) {
        filteredProjects = filteredProjects.filter((project) =>
          project.name.toLowerCase().includes(name.toLowerCase())
        )

        this._projects = filteredProjects
        return
      }

      if (projectId) {
        const project = filteredProjects.find((p) => p.id === projectId)
        if (project) {
          if (status) {
            const filteredTasks = project.tasks.filter((task) => task.status === status)
            this._filteredTasks = filteredTasks
          } else {
            this._filteredTasks = project.tasks
          }
        } else {
          this._filteredTasks = []
        }
      }
    },
    resetFilter() {
      this._projects = JSON.parse(localStorage.getItem('projects'))
    },
    resetFilterTasks() {
      this._filteredTasks = []
    },
    getTaskStatus(projectId) {
      const project = this._projects.find((p) => p.id === projectId)
      if (!project) {
        this._taskCounts = { Pendiente: 0, 'En progreso': 0, Completada: 0 }
        return
      }
      const counts = {
        Pendiente: 0,
        'En progreso': 0,
        Completada: 0
      }
      project.tasks.forEach((task) => {
        if (task.status in counts) {
          counts[task.status]++
        }
      })
      this._taskCounts = counts
    },

    getTaskStatusGeneral() {
      this._projects.forEach((project) => {
        project.tasks.forEach((task) => {
          if (task.status in this._taskCountsGeneral) {
            this._taskCountsGeneral[task.status]++
          }
        })
      })
      this._taskCountsGeneral = { ...this._taskCountsGeneral }
    },
    reset() {
      this._projects = JSON.parse(localStorage.getItem('projects')) || []
    },

    changeStatus(status, error = null) {
      this._status = status
      if (status === 'error') this._error = error
    }
  }
})
