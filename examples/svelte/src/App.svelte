<script>
    import { router } from './router.js';

    import Header from './Header.svelte';
    import Footer from './Footer.svelte';
    import Item from './Item.svelte';

    import "./app.css";
    import "todomvc-app-css/index.css";
    import "todomvc-common/base.css";

    let currentFilter = $state("all");
    let items = $state([]);

    function addItem(text) {
        items.push({
            id: crypto.randomUUID(), // This only works in secure-context.
            description: text,
            completed: false,
        });
    }

    function removeItem(id) {
        const index = items.findIndex((item) => item.id === id);
        if (index !== -1) items.splice(index, 1);
    }

    function toggleAllItems(event) {
        const checked = event.target.checked;
        for (const item of items) {
            item.completed = checked;
        }
    }

    function removeCompletedItems() {
        items = items.filter((item) => !item.completed);
    }

    $effect(() => {
        router((route) => (currentFilter = route)).init();
    });

    const filtered = $derived(
        currentFilter === "all"
            ? items
            : currentFilter === "completed"
                ? items.filter((item) => item.completed)
                : items.filter((item) => !item.completed)
    );
    const numActive = $derived(items.filter((item) => !item.completed).length);
    const numCompleted = $derived(items.filter((item) => item.completed).length);
</script>

<Header onAddItem={addItem} />

{#if items.length > 0}
    <main class="main">
        <div class="toggle-all-container">
            <input id="toggle-all" class="toggle-all" type="checkbox" onchange={toggleAllItems} checked={numCompleted === items.length} />
            <label for="toggle-all">Mark all as complete</label>
        </div>
        <ul class="todo-list">
            {#each filtered as item (item.id)}
                <Item {item} onRemoveItem={() => removeItem(item.id)} />
            {/each}
        </ul>

        <Footer {numActive} {currentFilter} {numCompleted} onRemoveCompletedItems={removeCompletedItems} />
    </main>
{/if}
