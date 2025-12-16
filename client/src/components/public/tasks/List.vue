<script setup lang="ts">
import { computed } from 'vue';
import { useAuth } from '@/composables/useAuth';
import Item from './Item.vue';

const { user } = useAuth();

const isAuthenticated = computed(() => !!user.value);
const isFreelancer = computed(() => user.value?.role === 'FREELANCER');

const isAllowedToBid = computed(() => isAuthenticated.value && isFreelancer.value);

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

defineProps<{
    tasks: ITask[];
}>();
</script>

<template>
    <div class="space-y-6">
        <Item v-for="task in tasks" :key="task.id" :task="task" :isAllowedToBid="isAllowedToBid" />
    </div>
</template>

