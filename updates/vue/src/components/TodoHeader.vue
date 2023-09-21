<template>
    <header class="header">
        <h1>todos</h1>
        <input
            type="text"
            class="new-todo"
            autofocus
            autocomplete="off"
            placeholder="What needs to be done?"
            @keyup.enter="
                $emit('add-todo', $event.target.value);
                $event.target.value = '';
            "
        />
    </header>
</template>

<script>
export default {
    name: "TodoHeader",
    emits: ["add-todo"],
};
</script>
