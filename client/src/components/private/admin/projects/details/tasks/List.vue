<script setup lang="ts">
interface IProjectTask {
  id: string;
  name: string;
  description: string;
  status: string;
  price: number;
  skills: string[];
}

defineProps<{
    tasks: IProjectTask[];
}>();
</script>

<template>
     <div class="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
          <div
            v-for="task in tasks"
            :key="task.id"
            class="group bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 p-6"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {{ task.name }}
                  </h3>
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wide"
                    :class="
                      task.status === 'OPEN'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-50 text-gray-700 border border-gray-200'
                    "
                  >
                    {{ task.status }}
                  </span>
                </div>
                <p class="text-sm text-gray-600">{{ task.description }}</p>
              </div>
              
              <div class="ml-4 text-right">
                <p class="text-sm text-gray-500 mb-1">Price</p>
                <p class="text-2xl font-bold text-gray-900">${{ task.price }}</p>
              </div>
            </div>

            <!-- Skills -->
            <div class="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
              <span
                v-for="skill in task.skills"
                :key="skill"
                class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
</template>