<script setup lang="ts">
interface Props {
  isOpen: boolean;
  modalWidth?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modalWidth: 'max-w-2xl',
});

const emit = defineEmits<{
  close: [];
}>();



const handleClose = () => {
  emit('close');
};
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-300"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="isOpen"
            :class="modalWidth"
            class="relative bg-white rounded-lg shadow-xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            @click.stop
          >
            <!-- Close Button -->
            <button
              @click="handleClose"
              class="absolute cursor-pointer top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <OhVueIcon name="hi-x" class="h-5 w-5" />
            </button>

            <!-- Slot Content -->
            <div class="p-6">
              <slot />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Additional custom styles if needed */
</style>

