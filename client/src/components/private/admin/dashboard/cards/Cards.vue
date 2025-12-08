<script setup lang="ts">
import Card from './Card.vue';

interface IDashboardCard {
    title: string;
    value: number;
    icon: string;
    iconColor: string;
}

defineProps<{
    cards: IDashboardCard[];
    loading: boolean;
}>();
</script>

<template>
    <template v-if="loading">
        <div
            v-for="i in 6"
            :key="i"
            class="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        >
            <div class="flex items-center justify-between">
                <div class="flex-1">
                    <div class="h-4 bg-gray-200 rounded w-24 mb-3 animate-pulse"></div>
                    <div class="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
                <div class="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
        </div>
    </template>
    <template v-else>
        <Card
            v-for="card in cards"
            :key="card.title"
            :title="card.title"
            :value="card.value"
            :icon="card.icon"
            :iconColor="card.iconColor"
        />
    </template>
</template>