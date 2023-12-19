<script>
    import { onMount } from 'svelte';
    import { router } from './router.js';

    import Header from './Header.svelte';
    import Footer from './Footer.svelte';
    import Item from './Item.svelte';

    import "./app.css";
    import "todomvc-app-css/index.css";
    import "todomvc-common/base.css";

    let currentFilter = "all";
    let items = [];

    function addItem(event) {
        items.push({
            id: crypto.randomUUID(), // This only works in secure-context.
            description: event.detail.text,
            completed: false,
        });
        items = items;
    }

    function removeItem(index) {
        items.splice(index, 1);
        items = items;
    }

    function toggleAllItems(event) {
        const checked = event.target.checked;
        items = items.map((item) => ({
            ...item,
            completed: checked,
        }));
    }

    function removeCompletedItems() {
        items = items.filter((item) => !item.completed);
    }
    
    onMount(() => {
      router(route => currentFilter = route).init();
    });

    $: filtered = currentFilter === "all" ? items : currentFilter === "completed" ? items.filter((item) => item.completed) : items.filter((item) => !item.completed);
    $: numActive = items.filter((item) => !item.completed).length;
    $: numCompleted = items.filter((item) => item.completed).length;
</script>

<Header on:addItem={addItem} />

{#if items.length > 0}
    <main class="main">
        <div class="toggle-all-container">
            <input id="toggle-all" class="toggle-all" type="checkbox" on:change={toggleAllItems} checked={numCompleted === items.length} />
            <label for="toggle-all">Mark all as complete</label>
        </div>
        <ul class="todo-list">
            {#each filtered as item, index (item.id)}
                <Item bind:item on:removeItem={() => removeItem(index)} />
            {/each}
        </ul>

        <Footer {numActive} {currentFilter} {numCompleted} on:removeCompletedItems={removeCompletedItems} />
    </main>
{/if}
