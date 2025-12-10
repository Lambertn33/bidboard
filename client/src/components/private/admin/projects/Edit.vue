<script setup lang="ts">
    import { computed, ref, watch } from 'vue';
    import Input from '@/components/ui/Input.vue';
    import TextArea from '@/components/ui/TextArea.vue';
    

    interface IProjectData {
      id: string;
      name: string;
      description: string;
    }
    const emit = defineEmits<{
      (e: 'edit-project', payload: { name: string; description: string }): void;
    }>();
        
        const props = defineProps<{
          project: IProjectData;
          isUpdatingProjectPending: boolean;
        }>();
        
    const form = ref({
      name: props.project.name,
      description: props.project.description,
    });

// Sync form when incoming project changes
      watch(
        () => props.project,
        (project) => {
          if (project) {
            form.value = {
              name: project.name ?? '',
              description: project.description ?? '',
            };
          }
        },
        { immediate: true },
      );
    
    const isSubmitDisabled = computed(() => !form.value.name.trim() || !form.value.description.trim());
    
    const handleSubmit = () => {
  emit('edit-project', {
        name: form.value.name.trim(),
        description: form.value.description.trim(),
      });
      // Don't reset here - wait for success from parent
    };
    
    const handleReset = () => {
      form.value = { name: props.project.name, description: props.project.description };
    };
    
    // Expose reset method to parent component
    defineExpose({
      reset: handleReset,
    });
    </script>
    
    <template>
      <div class="bg-white rounded-2xl p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Projects</p>
            <h2 class="text-xl font-bold text-gray-900">Edit Project</h2>
          </div>
        </div>
    
        <form class="space-y-5" @submit.prevent="handleSubmit">
          <Input
            id="project-name"
            label="Project Name"
            type="text"
            placeholder="Enter new project name"
            :modelValue="form.name"
            :required="true"
            :hasPreIcon="false"
            @update:modelValue="(value: string) => (form.name = value)"
          />
    
          <TextArea
            id="project-description"
            label="Description"
            placeholder="Write a new short description..."
            :modelValue="form.description"
            :required="false"
            @update:modelValue="(value: string) => (form.description = value)"
          />
    
          <div class="flex items-center gap-3 pt-2">
            <button
              type="submit"
              :disabled="isSubmitDisabled || isUpdatingProjectPending"
              class="inline-flex justify-center px-5 py-3 rounded-lg text-sm font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {{ isUpdatingProjectPending ? 'Please wait...' : 'Update Project' }}
            </button>
          </div>
        </form>
      </div>
    </template>