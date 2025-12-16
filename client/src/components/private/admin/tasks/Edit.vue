<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { OhVueIcon } from 'oh-vue-icons';
    import {Input, TextArea, Select} from "@/components/ui";

    interface ITask {
      id: string;
      name: string;
      description: string;
      project: {
        id: string;
        name: string;
      };
      price: number;
      skills: string[];
    }

    interface IProject {
      id: string;
      name: string;
    }
    
    const emit = defineEmits<{
      (e: 'editTask', payload: { name: string; description: string; project_id: string | null; price: number; skills: string[] }): void;
    }>();
    
    const props = defineProps<{
      isEditingTaskPending: boolean;
      projects: IProject[];
      taskToEdit: ITask;
    }>();

    const skillInput = ref('');
    
    const form = ref<{
      name: string;
      description: string;
      project_id: string | null;
      price: number;
      skills: string[];
    }>({
      name: props.taskToEdit.name,
      description: props.taskToEdit.description,
      project_id: props.taskToEdit.project.id,
      price: props.taskToEdit.price,
      skills: props.taskToEdit.skills,
    });
    
    const addSkillToList = (skill: string) => {
      if (skill.trim()) {
        form.value.skills.push(skill.trim());
        skillInput.value = '';
      }
    };
    
    const handleSkillKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (skillInput.value.trim()) {
          addSkillToList(skillInput.value);
        }
      }
    };
    
    const removeSkillFromList = (skill: string) => {
      form.value.skills = form.value.skills.filter((s) => s !== skill);
    };

    const projectOptions = computed(() => 
      props.projects.map((project) => ({
        value: project.id,
        label: project.name,
      }))
    );
    
    const isSubmitDisabled = computed(() => !form.value.name.trim() || !form.value.description.trim() || !form.value.project_id || form.value.skills.length === 0);
    
    const handleSubmit = () => {
      emit('editTask', {
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
            <h2 class="text-xl font-bold text-gray-900">Edit Task</h2>
          </div>
        </div>
    
        <form class="space-y-5" @submit.prevent="handleSubmit">
         <div class="flex flex-col sm:flex-row  gap-3">
            <div class="flex-1">
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
            </div>
            <div class="flex-1">
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
            </div>
          </div>
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
          <Input
            id="task-skill"
            label="Skills (Enter and press Enter to add multiple skills)"
            type="text"
            placeholder="Enter skill and press Enter"
            :modelValue="skillInput"
            :required="form.skills.length === 0"
            :hasPreIcon="false"
            @keydown="handleSkillKeydown"
            @update:modelValue="(value: string) => (skillInput = value)"
          />

          <div v-if="form.skills.length > 0" class="flex flex-wrap gap-2">
            <div
              v-for="skill in form.skills"
              :key="skill"
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium"
            >
              <span>{{ skill }}</span>
              <button
                @click="removeSkillFromList(skill)"
                class="flex cursor-pointer items-center justify-center hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                type="button"
              >
                <OhVueIcon name="io-close" class="w-4 h-4" />
              </button>
            </div>
          </div>

    
          <div class="flex items-center gap-3 pt-2">
            <button
              type="submit"
              :disabled="isSubmitDisabled || isEditingTaskPending"
              class="inline-flex justify-center px-5 py-3 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {{ isEditingTaskPending ? 'Please wait...' : 'Edit Task' }}
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