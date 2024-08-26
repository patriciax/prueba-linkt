<script setup>
import { BriefcaseIcon, HomeIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

const isOpen = ref(false)
</script>
<template>
  <section class="flex items-center justify-between lg:hidden">
    <router-link to="/" class="flex items-center ps-2.5 lg:mb-5">
      <div class="bg-violet-500 rounded-full p-2 mr-2">
        <BriefcaseIcon class="text-white w-4 h-4" />
      </div>
      <span class="self-center text-lg font-bold whitespace-nowrap dark:text-white">Planify</span>
    </router-link>
    <button
      @click="isOpen = !isOpen"
      data-drawer-target="logo-sidebar"
      data-drawer-toggle="logo-sidebar"
      aria-controls="logo-sidebar"
      type="button"
      class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400"
    >
      <svg
        class="w-6 h-6"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clip-rule="evenodd"
          fill-rule="evenodd"
          d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
        ></path>
      </svg>
    </button>
  </section>

  <aside
    id="logo-sidebar"
    class="fixed top-0 left-0 z-40 w-52 xl:w-60 h-screen transition-transform -translate-x-full lg:translate-x-0"
    aria-label="Sidebar"
    :class="{ 'lg:translate-x-0 transform-none': isOpen }"
  >
    <div
      @click="isOpen = false"
      class="h-full px-3 py-4 overflow-y-auto bg-slate-50 dark:bg-gray-800"
    >
      <router-link to="/" class="flex items-center mb-8 px-4">
        <div class="bg-violet-500 rounded-full p-2 mr-2">
          <BriefcaseIcon class="text-white w-4 h-4" />
        </div>
        <span class="self-center text-lg font-bold whitespace-nowrap dark:text-white">Planify</span>
      </router-link>
      <ul class="space-y-2 font-medium">
        <li>
          <router-link
            :to="{ name: 'home' }"
            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <HomeIcon
              class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            />
            <span class="ms-3">Inicio</span>
          </router-link>
        </li>
        <li>
          <router-link
            active-class="bg-gray-100 dark:bg-gray-700"
            to="/projects"
            class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <BriefcaseIcon
              class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
            />
            <span class="ms-3">Proyectos</span>
          </router-link>
        </li>
      </ul>
    </div>
  </aside>
</template>
