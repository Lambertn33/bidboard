<script setup lang="ts">
import Item from './Item.vue';

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
        <Item v-for="task in tasks" :key="task.id" :task="task" />
    </div>
</template>

