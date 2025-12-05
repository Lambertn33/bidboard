<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { getTasks } from '@/api/public/tasks.api';

const { isPending, isError, data, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
});

</script>

<template>
    <div>
        <h1>Tasks</h1>
    </div>
</template>