<script setup lang="ts">
import { computed } from 'vue';
import { getStartTimeInDays } from '@/reusables';

interface IBidFreelancer {
  id: string;
  telephone: string;
  user: {
    id: string;
    names: string;
  };
}

interface IBid {
  id: string;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  task: {
    id: string;
    name: string;
  };
  freelancer: IBidFreelancer;
  createdAt: string;
}
    

const props = defineProps<{
    bid: IBid;
}>();

const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        ACCEPTED: 'bg-green-100 text-green-800',
        REJECTED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
};

const timeAgo = computed(() => getStartTimeInDays(props.bid.createdAt));
</script>

<template>
    <div class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div class="flex items-start justify-between">
            <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                      <h3 class="font-medium text-gray-900">{{ bid.task.name }}</h3>
                      <span :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusColor(bid.status)]">
                        {{ bid.status }}
                      </span>
                </div>
                <p class="text-sm text-gray-600 mb-2">
                    by 
                    <span class="font-medium">
                        {{ bid.freelancer.user.names }}
                    </span>
                </p>
                <p class="text-sm text-gray-700 line-clamp-2">{{ bid.message }}</p>
                <p class="text-xs text-gray-500 mt-2">{{ timeAgo }}</p>
            </div>
            <div class="ml-4 flex gap-2">
                <button v-if="bid.status === 'PENDING'"
                    class="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                     Accept
                </button>
                <button
                    v-if="bid.status === 'PENDING'"
                    class="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                >
                    Reject
                </button>
            </div>
        </div>
    </div>
</template>