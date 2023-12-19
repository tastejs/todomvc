<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function addItem(e) {
        if (e.key !== 'Enter') return;
        dispatch('addItem', {
            text: e.target.value
        });
        e.target.value = "";
    }
</script>

<header class="header">
    <h1>todos</h1>
    <!-- svelte-ignore a11y-autofocus -->
    <input class="new-todo" on:keydown={addItem} placeholder="What needs to be done?" autofocus />
</header>