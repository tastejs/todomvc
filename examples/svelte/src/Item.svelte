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
        <div class="input-container">
            <input value={item.description} id="edit-todo-input" class="edit" onkeydown={handleEdit} onblur={updateItem} use:focusInput />
            <label class="visually-hidden" for="edit-todo-input">Edit Todo Input</label>
        </div>
    {/if}
</li>
