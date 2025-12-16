<script setup lang="ts">
import { ref, inject, computed, type ComputedRef, type Ref } from 'vue';
import { OhVueIcon } from 'oh-vue-icons';

interface ITask {
    id: string;
    name: string;
    description: string;
    status: string;
    project: {
        id: string;
        name: string;
    };
    price: number;
    skills: string[];
}


const props = defineProps<{
    task: ITask;
}>();

const biddingInfo = inject<{
    isAllowedToBid: ComputedRef<boolean> | boolean;
    isBiddingModalOpen: Ref<boolean> | boolean;
    openBiddingModal: (taskId: string) => void;
    closeBiddingModal: () => void;
}>('biddingInfo');

const isAllowedToBid = computed(() => {
  if (!biddingInfo) return false;
  const value = biddingInfo.isAllowedToBid;
  return typeof value === 'object' && 'value' in value ? value.value : value;
});

const openBiddingModal = () => biddingInfo?.openBiddingModal(props.task.id);

const isDescriptionOpen = ref(false);

const toggleDescription = () => {
    isDescriptionOpen.value = !isDescriptionOpen.value;
};
</script>

<template>
    <div
        class="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
        <div class="p-8">
            <!-- Header Row -->
            <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                    <div class="flex flex-col md:flex-row items-start md:items-center gap-3 mb-3">
                        <h2 class="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {{ task.name }}
                        </h2>
                        <span
                            class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide"
                            :class="task.status === 'OPEN' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-50 text-gray-700 border border-gray-200'"
                        >
                            {{ task.status }}
                        </span>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-gray-500">
                        <OhVueIcon name="bi-folder-fill" class="h-4 w-4 text-blue-500" />
                        <span class="font-medium">{{ task.project.name }}</span>
                    </div>
                </div>
                
                <!-- Price -->
                <div class="ml-4 text-right">
                    <div class="text-3xl font-bold text-gray-900">${{ task.price }}</div>
                </div>
            </div>

            <!-- Description -->
            <Transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-300 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-2"
            >
                <div v-if="isDescriptionOpen" class="mb-4 pt-4">
                    <p class="text-gray-600 leading-relaxed font-bold">
                        {{ task.description }}
                    </p>
                </div>
            </Transition>

            <!-- Skills and Action -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-100">
                <div class="flex flex-wrap gap-2">
                    <span
                        v-for="skill in task.skills"
                        :key="skill"
                        class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                        {{ skill }}
                    </span>
                </div>
                
                <div class="flex items-center gap-2">
                    <button
                    @click="toggleDescription"
                    class="cursor-pointer px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2 whitespace-nowrap flex justify-center"
                >
                    <span class="font-bold">{{ isDescriptionOpen ? 'Hide Description' : 'Read Description' }}</span>
                    <OhVueIcon 
                        name="hi-arrow-down" 
                        class="h-4 w-4 transition-transform duration-300"
                        :class="{ 'rotate-180': isDescriptionOpen }"
                    />
                </button>
                <button
                    v-if="isAllowedToBid"
                    @click="openBiddingModal"
                    class="cursor-pointer px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2 whitespace-nowrap flex justify-center"
                >
                    <span class="font-bold">Bid on Task</span>
                    <OhVueIcon name="hi-arrow-right" class="h-4 w-4" />
                </button>
                </div>
            </div>
        </div>
    </div>
</template>

