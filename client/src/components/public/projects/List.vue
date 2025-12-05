<script setup lang="ts">
interface IProject {
    id: string;
    name: string;
    description: string;
    _count: {
        tasks: number;
    };
}

import Item from './Item.vue';
const props = defineProps<{
    projects: IProject[];
}>();
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Item v-for="project in props.projects" :key="project.id" :project="project" />
      </div>
</template>