<script setup>
import { RouterLink } from 'vue-router';
import { ref } from 'vue';

const TAGS = [
    { value: 'personal', name: '个人', color: '#2ecc71' },
    { value: 'work', name: '工作', color: '#3498db' },
    { value: 'urgent', name: '紧急', color: '#e74c3c' }
];

const emit = defineEmits(['add-todo']);

const selectedTag = ref('personal');
const inputRef = ref(null);
</script>

<template>
  <header class="header">
    <RouterLink to="/"><h1>todos</h1></RouterLink>
    <div class="input-with-tag">
        <input
            ref="inputRef"
            type="text"
            class="new-todo"
            autofocus
            autocomplete="off"
            placeholder="What needs to be done?"
            @keyup.enter="
                if ($event.target.value.trim()) {
                    $emit('add-todo', $event.target.value.trim(), selectedTag);
                    $event.target.value = '';
                }
            "
        />
        <div class="tag-select-wrapper">
            <select 
                v-model="selectedTag" 
                class="tag-select"
            >
                <option v-for="tag in TAGS" :key="tag.value" :value="tag.value">
                    {{ tag.name }}
                </option>
            </select>
            <span 
                class="tag-indicator"
                :style="{ backgroundColor: TAGS.find(t => t.value === selectedTag)?.color }"
            ></span>
        </div>
    </div>
  </header>
</template>

<style scoped>
.input-with-tag {
    position: relative;
    display: flex;
    align-items: center;
}

.new-todo {
    padding-right: 120px !important;
}

.tag-select-wrapper {
    position: absolute;
    right: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.tag-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
}

.tag-select {
    padding: 4px 24px 4px 8px;
    font-size: 14px;
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    background: #fff;
    color: #4d4d4d;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234d4d4d' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 6px center;
    padding-right: 24px;
}

.tag-select:hover {
    border-color: #cfcfcf;
}

.tag-select:focus {
    outline: none;
    border-color: #b83f45;
}
</style>
