<script setup lang="ts">
import { computed, ref } from 'vue';
import { getStartTimeInDays, formatDate } from '@/reusables';
import { DetailsHeader, DetailsLoading, DetailsError, Details, Freelancer } from '@/components/private/admin/works';

// Mock data - replace with actual API call later
interface TaskWork {
  id: string;
  startDate: string;
  endDate: string;
  completionUrl: string | null;
  status: "IN_PROGRESS" | "COMPLETED";
  task: {
    id: string;
    name: string;
    description: string;
  };
  freelancer: {
    id: string;
    telephone: string;
    user: {
      id: string;
      names: string;
      email: string;
    };
  };
}

const mockWorkData: TaskWork = {
  id: "f3720cf0-b9d7-4d7c-8d5c-eb41f3d53979",
  startDate: "2025-12-17T19:08:39.541Z",
  endDate: "2025-12-27T00:00:00.000Z",
  completionUrl: null,
  status: "IN_PROGRESS",
  task: {
    id: "d1378a50-cae2-4257-89ec-0e3e83fd083d",
    name: "Data Cleanup Task 3",
    description: "Deliverable 3 for Data Cleanup."
  },
  freelancer: {
    id: "4169208f-659c-4696-a9ae-54c5b479e4a4",
    telephone: "+250785292979",
    user: {
      id: "442d9e96-5a04-4562-9167-ffca095c830f",
      names: "Nsengimana Lambert",
      email: "lamb@gmail.com"
    }
  }
};

const work = ref(mockWorkData);
const isPending = ref(false);
const isError = ref(false);
const errorMessage = ref('');



const refetch = () => {
  // TODO: Implement actual refetch logic
  console.log('Refetching work data...');
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
     <DetailsHeader 
      :isPending="isPending"
      :taskName="work.task.name"
      :taskDescription="work.task.description"
      :workStatus="work.status"
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

        <!-- Right Column: Freelancer & Stats -->
        <div class="space-y-6">
          <!-- Freelancer Information Card -->
          <Freelancer
            :freelancerName="work.freelancer.user.names"
            :freelancerEmail="work.freelancer.user.email"
            :freelancerTelephone="work.freelancer.telephone"
          />
        </div>
      </div>

      <!-- Fallback for no data -->
      <div v-else class="text-center text-gray-600">No work data available.</div>
    </div>
  </div>
</template>

