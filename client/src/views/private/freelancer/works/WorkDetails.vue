<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { DetailsHeader, DetailsLoading, DetailsError, Details, Payment, Submit } from '@/components/private/common/works';
import { useFetchWork } from '@/composables/useFetchWork';
import { submitWork as submitWorkApi } from '@/api/private/freelancer/works';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { Modal } from '@/components/ui';
import { useRoute } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useToast } from '@/composables/useToast';

const { user, refreshUser } = useAuth();

const queryClient = useQueryClient();

const { success: showSuccessToast, error: showErrorToast } = useToast();

const isFreelancer = computed(() => user.value?.role === 'FREELANCER');

const route = useRoute();

const { isPending, isError, workData, errorMessage, refetch } = useFetchWork(route.params.id as string);

const work = computed(() => workData.value);

const canSubmitWork = computed(() => isFreelancer.value && work.value?.status === 'IN_PROGRESS');

// Refresh user balance when payment status changes to PAID
watch(
  () => work.value?.payment?.status,
  (newStatus) => {
    if (newStatus === 'PAID') {
      refreshUser();
    }
  }
);

const isSubmitWorkModalOpen = ref(false);

const openSubmitWorkModal = () => {
  isSubmitWorkModalOpen.value = true;
};

const closeSubmitWorkModal = () => {
  isSubmitWorkModalOpen.value = false;
};

const { mutate: submitWorkMutation, isPending: isSubmittingWorkPending } = useMutation({
  mutationFn: (completionUrl: string) => submitWorkApi(route.params.id as string, completionUrl),
  onSuccess: (response) => {
    showSuccessToast(response?.message || 'Work submitted successfully');
    queryClient.invalidateQueries({ queryKey: ['work', route.params.id] });
    queryClient.invalidateQueries({ queryKey: ['works'] });
    closeSubmitWorkModal();
  },
  onError: (error) => {
    showErrorToast(error?.message || 'Failed to submit work. Please try again.');
  },
});

const submitWork = (completionUrl: string) => {
  submitWorkMutation(completionUrl);
};
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
      backLink="/freelancer/works"
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
          :canSubmitWork="canSubmitWork"
          @openSubmitWorkModal="openSubmitWorkModal"
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
  <Modal :isOpen="isSubmitWorkModalOpen" @close="closeSubmitWorkModal">
    <Submit :isSubmittingWorkPending="isSubmittingWorkPending" @submitWork="submitWork" />
  </Modal>
</template>

