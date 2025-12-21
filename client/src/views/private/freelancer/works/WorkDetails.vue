<script setup lang="ts">
import { computed } from 'vue';
import { DetailsHeader, DetailsLoading, DetailsError, Details, Payment } from '@/components/private/freelancer/works';
import { useFetchWork } from '@/composables/useFetchWork';
import { useRoute } from 'vue-router';

const route = useRoute();

const { isPending, isError, workData, errorMessage, refetch } = useFetchWork(route.params.id as string);

const work = computed(() => workData.value);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <DetailsHeader 
      v-if="work && !isPending && !isError"
      :isPending="isPending"
      :taskName="work!.task!.name"
      :taskDescription="work!.task!.description"
      :workStatus="work!.status"
    />
    
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <DetailsLoading v-if="isPending" />

      <!-- Error State -->
      <DetailsError v-else-if="isError" :errorMessage="errorMessage" @refetch="refetch" />

      <!-- Data State -->
      <div v-else-if="work" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Work Details -->
        <Details
          :workStatus="work.status"
          :workStartDate="work.startDate"
          :workEndDate="work.endDate"
          :workCompletionUrl="work.completionUrl"
          :workTaskName="work.task.name"
          :workTaskDescription="work.task.description"
        />

        <!-- Right Column: Payment -->
        <div class="space-y-6">
          <!-- Payment Information Card -->
          <Payment
            v-if="work.payment"
            :paymentAmount="work.payment.amount"
            :paymentStatus="work.payment.status"
            :paymentUpdatedAt="work.payment.updatedAt"
          />
        </div>
      </div>

      <!-- Fallback for no data -->
      <div v-else class="text-center text-gray-600">No work data available.</div>
    </div>
  </div>
</template>

