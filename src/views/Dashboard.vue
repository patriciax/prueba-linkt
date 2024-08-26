<script setup>
import Sidebar from '@/components/Sidebar.vue'
</script>
<template>
  <Sidebar />
  <div class="p-4 lg:ml-56">
    <div class="rounded-lg">
      <RouterView />
    </div>
  </div>
</template>
