<script setup lang="ts">
    const props = defineProps<{
      bidMessage: string;
      bidFreelancerName: string;
      bidTaskName: string;
    }>();
    
    </script>
    
    <template>
      <div class="bg-white rounded-2xl p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Bid on Task: {{ bidTaskName }}</h2>
            <p class="text-sm text-gray-600 mb-2">
                by 
                <span class="font-bold text-gray-900">
                    {{ bidFreelancerName }}
                </span>
            </p>
          </div>
        </div>

        <div class="flex flex-col items-start gap-1 border border-gray-200 p-4 rounded-lg bg-gray-50 mb-8">
            <span class="font-medium text-gray-600">Message:</span>
            <p class="font-bold text-gray-900">
                {{ bidMessage }}
            </p>
        </div>
      </div>
    </template>