<script setup>
import Button from '@/components/common/Btn.vue'
import Dropdown from '@/components/common/Dropdown.vue'
import TextFields from '@/components/common/TextFields.vue'
import { showNotification } from '@/composables/useNotification'
import useProjectStore from '@/stores/projects'
import { EyeDropperIcon, PlusIcon } from '@heroicons/vue/24/outline'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { onMounted, ref, watch } from 'vue'

const emit = defineEmits(['close', 'reload'])
const props = defineProps({
  isEdit: {
    type: Boolean
  }
})

const projectStore = useProjectStore()

const dataForm = ref({
  name: '',
  description: '',
  color: 'border-violet-500'
})

const colors = ref([
  {
    name: 'Azul',
    value: 'border-blue-400'
  },
  {
    name: 'Rojo',
    value: 'border-red-400'
  },
  {
    name: 'Verde',
    value: 'border-green-400'
  }
])

const resetForm = () => {
  dataForm.value = {
    name: '',
    description: '',
    color: 'border-violet-500'
  }

  handlerValidate.value.$reset()
}

const resetColor = (_closeDropdown) => {
  dataForm.value.color = 'border-violet-500'
  _closeDropdown()
}

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

const selectedColor = (color, _closeDropdown) => {
  dataForm.value.color = color
  _closeDropdown()
}

const sendForm = async () => {
  const _validate = await handlerValidate.value.$validate()
  if (!_validate) return

  if (props.isEdit) {
    projectStore.updateProject(dataForm.value)
    showNotification('Proyecto actualizado', 'success')
    emit('close')
    emit('reload', dataForm.value)
    resetForm()
    return
  }

  projectStore.addProject(dataForm.value)
  showNotification('Proyecto agregado', 'success')
  emit('close')

  resetForm()
}

onMounted(() => {
  if (props.isEdit && projectStore.currentProject) {
    dataForm.value = { ...projectStore.currentProject }
  }
})

watch(
  () => projectStore.currentProject,
  (newVal) => {
    if (props.isEdit && newVal) {
      dataForm.value = { ...newVal }
    }
  }
)
</script>
<template>
  <section class="max-w-sm mx-auto">
    <h2 class="text-xl font-bold mb-6">
      {{ props.isEdit ? 'Editar Proyecto' : 'Agregar Proyecto' }}
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
        <div class="absolute right-0 top-5">
          <Dropdown>
            <template v-slot:trigger="{ openDropdown, isOpen }">
              <button
                type="button"
                class="my-2 outline-none flex items-center bg-transparent hover:bg-opacity-90 font-bold gap-1 item-pcenter group relative hover:text-white text-white py-1.5 rounded-md px-2 justify-center"
                @click="openDropdown"
              >
                <div
                  v-if="dataForm.color !== 'border-violet-500'"
                  class="mr-1 text-sm md:text-base"
                >
                  <div
                    :class="` ${dataForm.color}`"
                    class="border-2 h-[14px] w-[14px] rounded-full"
                  />
                </div>
                <EyeDropperIcon
                  v-else
                  class="hidden lg:block text-gray transition-all w-4 h-4 text-black ease-in-out"
                  :class="{ 'text-violet-500': isOpen }"
                />
              </button>
            </template>
            <template v-slot:content="{ closeDropdown }">
              <section class="px-2 py-2">
                <p class="text-xs mb-2 font-semibold text-gray-600" v-text="'Color'"></p>
                <button
                  type="button"
                  class="flex items-center text-sm hover:bg-gray-100 w-full p-2 rounded-md"
                  v-for="color in colors"
                  :key="color.value"
                  @click="selectedColor(color.value, closeDropdown)"
                >
                  <div
                    :class="` ${color.value}`"
                    class="border-2 h-[14px] w-[14px] mr-2 rounded-full"
                  />
                  {{ color.name }}
                </button>
                <p
                  @click="resetColor(closeDropdown)"
                  class="text-sm mt-2 border-t pt-2 text-center text-gray-600"
                  v-text="'Borrar color'"
                ></p>
              </section>
            </template>
          </Dropdown>
        </div>
      </section>

      <TextFields
        id="description"
        class="mb-6"
        v-model="dataForm.description"
        isRequired
        :errorMessage="
          handlerValidate?.['description']?.$errors?.length > 0
            ? 'Este campo es requerido'
            : undefined
        "
        name="name"
        placeholder=""
        label="Descripción "
      />

      <Button class="w-full" withIcon>
        <template #icon>
          <PlusIcon v-if="!props.isEdit" class="w-5 h-5" />
        </template>
        {{ props.isEdit ? 'Actualizar' : 'Agregar Proyecto' }}
      </Button>
    </form>
  </section>
</template>
