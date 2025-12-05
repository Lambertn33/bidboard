<script setup lang="ts">
import { ref } from 'vue';
import { Modal } from '@/components/ui';

interface IProject {
    id: string;
    name: string;
    description: string;
    _count: {
        tasks: number;
    };
}

const props = defineProps<{
    project: IProject;
}>();

const isModalOpen = ref(false);

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};
</script>

<template>
    <div
          class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
        >
          <div class="p-6">
            <!-- Project Name -->
            <h2 class="text-2xl font-bold text-gray-900 mb-3 line-clamp-1">
              {{ project.name }}
            </h2>

            <!-- Project Description -->
            <p class="text-gray-600 text-sm mb-4 line-clamp-3 min-h-[60px] font-medium">
              {{ project.description }}
            </p>

            <!-- Task Count Badge -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
              <div class="flex items-center space-x-2">
                <OhVueIcon 
                  name="bi-list-task" 
                  class="h-5 w-5 text-gray-600" 
                />
                <span class="text-sm font-medium text-gray-700">
                  {{ project._count?.tasks || 0 }} {{ (project._count?.tasks || 0) === 1 ? 'Task' : 'Tasks' }}
                </span>
              </div>
              <button
                @click="openModal"
                class="text-blue-600 cursor-pointer hover:text-blue-700 font-medium text-sm transition-colors flex items-center space-x-1"
              >
                <span>View Tasks</span>
                <OhVueIcon name="hi-arrow-right" class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

    <!-- Modal -->
    <Modal :is-open="isModalOpen" @close="closeModal">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">
          Tasks for {{ project.name }}
        </h2>
        <p class="text-gray-600">
          Tasks content will go here...
        </p>
      </div>
    </Modal>
</template>