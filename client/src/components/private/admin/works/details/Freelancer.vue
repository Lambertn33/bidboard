<script setup lang="ts">
import { OhVueIcon } from 'oh-vue-icons';

defineProps<{
  freelancerName: string;
  freelancerEmail: string;
  freelancerTelephone: string;
}>();
</script>

<template>
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Freelancer</h3>
            <div class="space-y-4">
              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Name</p>
                <p class="text-base font-semibold text-gray-900">{{ freelancerName }}</p>
              </div>

              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Email</p>
                <div class="flex items-center gap-2">
                  <OhVueIcon name="hi-mail" class="h-4 w-4 text-gray-400" />
                  <a
                    :href="`mailto:${freelancerEmail}`"
                    class="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {{ freelancerEmail }}
                  </a>
                </div>
              </div>

              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">Telephone</p>
                <div class="flex items-center gap-2">
                  <OhVueIcon name="hi-phone" class="h-4 w-4 text-gray-400" />
                {{ freelancerTelephone }}
                </div>
              </div>
            </div>
          </div>
</template>