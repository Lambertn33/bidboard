<script setup lang="ts">
    import { computed, ref } from 'vue';
    import {Input, TextArea, Select} from "@/components/ui";

    interface IProject {
      id: string;
      name: string;
    }
    
    const emit = defineEmits<{
      (e: 'createTask', payload: { name: string; description: string; project_id: string | null; price: number; skills: string[] }): void;
    }>();
    
    const props = defineProps<{
      isCreatingTaskPending: boolean;
      projects: IProject[];
    }>();
    
    const form = ref<{
      name: string;
      description: string;
      project_id: string | null;
      price: number;
      skills: string[];
    }>({
      name: '',
      description: '',
      project_id: null,
      price: 0,
      skills: [],
    });
    
    const projectOptions = computed(() => 
      props.projects.map((project) => ({
        value: project.id,
        label: project.name,
      }))
    );
    
    const isSubmitDisabled = computed(() => !form.value.name.trim() || !form.value.description.trim() || !form.value.project_id || form.value.skills.length === 0);
    
    const handleSubmit = () => {
      emit('createTask', {
        name: form.value.name.trim(),
        description: form.value.description.trim(),
        project_id: form.value.project_id,
        price: form.value.price,
        skills: form.value.skills,
      });
      // Don't reset here - wait for success from parent
    };
    
    const handleReset = () => {
      form.value = { name: '', description: '', project_id: null, price: 0, skills: [] };
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
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tasks</p>
            <h2 class="text-xl font-bold text-gray-900">Create Task</h2>
          </div>
        </div>
    
        <form class="space-y-5" @submit.prevent="handleSubmit">
          <Input
            id="task-name"
            label="Task Name"
            type="text"
            placeholder="Enter task name"
            :modelValue="form.name"
            :required="true"
            :hasPreIcon="false"
            @update:modelValue="(value: string) => (form.name = value)"
          />
          <Input
            id="task-price"
            label="Price"
            type="number"
            placeholder="Enter task price"
            :modelValue="form.price.toString()"
            :required="true"
            :hasPreIcon="false"
            @update:modelValue="(value: string) => (form.price = Number(value))"
          />
          <Select
            id="task-project-id"
            label="Project"
            :options="projectOptions"
            :modelValue="form.project_id"
            :required="true"
            :placeholder="'Select a project'"
            @update:modelValue="(value: string | number | null) => (form.project_id = value as string | null)"
          />
    
          <TextArea
            id="task-description"
            label="Description"
            placeholder="Write a short description..."
            :modelValue="form.description"
            :required="false"
            @update:modelValue="(value: string) => (form.description = value)"
          />
    
          <div class="flex items-center gap-3 pt-2">
            <button
              type="submit"
              :disabled="isSubmitDisabled || isCreatingTaskPending"
              class="inline-flex justify-center px-5 py-3 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {{ isCreatingTaskPending ? 'Please wait...' : 'Create Task' }}
            </button>
            <button
              type="button"
              class="inline-flex justify-center px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              @click="handleReset"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </template>