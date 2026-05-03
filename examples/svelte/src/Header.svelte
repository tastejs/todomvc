<script>
    let { onAddItem } = $props();

    function addItem(e) {
        if (e.key !== 'Enter') return;
        const text = e.target.value.trim();
        if (text.length === 0) return;
        onAddItem(text);
        e.target.value = "";
    }
</script>

<header class="header">
    <h1>todos</h1>
    <!-- svelte-ignore a11y_autofocus -->
    <input class="new-todo" onkeydown={addItem} placeholder="What needs to be done?" autofocus />
</header>
