<script>
    import { tick } from 'svelte';

    let { item, onRemoveItem } = $props();

    let editing = $state(false);

    function startEdit() {
        editing = true;
    }

    function handleEdit(event) {
        if (event.key === "Enter")
            event.target.blur();
        else if (event.key === "Escape")
            editing = false;
    }

    function updateItem(event) {
        if (!editing) return;
        const { value } = event.target;
        if (value.length) {
            item.description = value;
        } else {
            onRemoveItem();
        }
        editing = false;
    }

    async function focusInput(element) {
        await tick();
        element.focus();
    }
</script>

<li class:completed={item.completed} class:editing>
    <div class="view">
        <input class="toggle" type="checkbox" onchange={(event) => item.completed = event.target.checked} checked={item.completed} />
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label ondblclick={startEdit}>{item.description}</label>
        <button onclick={onRemoveItem} class="destroy" aria-label="Delete"></button>
    </div>

    {#if editing}
        <input
            value={item.description}
            class="edit"
            aria-label="Edit todo"
            onkeydown={handleEdit}
            onblur={updateItem}
            use:focusInput
        />
    {/if}
</li>
