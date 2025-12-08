<script setup lang="ts">
import { computed } from 'vue';
import { OhVueIcon } from 'oh-vue-icons';

interface IWork {
    id: string;
    task: {
        id: string;
        name: string;
    };
    freelancer: {
        id: string;
        telephone: string;
        user: {
            id: string;
            names: string;
        };
    };
    startDate: string;
    endDate: string;
    completionUrl: string | null;
    status: "COMPLETED" | "IN_PROGRESS";
    createdAt: string;
}

const props = defineProps<{
    work: IWork;
}>();

const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        COMPLETED: 'bg-green-100 text-green-800',
        IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
};

const getStartTimeInDays = computed(() => {
    const startDate = new Date(props.work.startDate);
    const today = new Date();
    
    // Reset time to midnight for accurate day calculation
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Calculate difference in milliseconds
    const diffTime = end.getTime() - start.getTime();
    
    // Convert to days
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return '1 day ago';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return months === 1 ? '1 month ago' : `${months} months ago`;
    } else {
        const years = Math.floor(diffDays / 365);
        return years === 1 ? '1 year ago' : `${years} years ago`;
    }
});

</script>

<template>
    <div class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div class="flex items-center gap-2 mb-2">
            <h3 class="font-medium text-gray-900 text-sm">{{ work.task.name }}</h3>
            <span :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusColor(work.status)]">
                {{ work.status === 'IN_PROGRESS' ? 'In Progress' : 'Completed' }}
            </span>
        </div>
        <p class="text-sm text-gray-600 mb-2">by <span class="font-medium">{{ work.freelancer.user.names }}</span></p>
        <div v-if="work.completionUrl" class="mb-2">
            <a
                :href="work.completionUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
                <OhVueIcon name="hi-link" class="w-4 h-4" />
                    View work
            </a>
        </div>
        <p class="text-xs text-gray-500">{{ getStartTimeInDays }}</p>
    </div>
</template>