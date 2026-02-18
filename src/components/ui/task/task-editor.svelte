<script lang="ts">
    import { taskStore } from "@/lib/task/store.svelte";
    import { type Task } from "@/lib/task/type";

    // The component receives the selected task id with a function that 
    // handles the behavior of the open and close state of the editor. 
    interface EditorProps {
        taskId: string | null, 
        toggleFn: () => void
    }
    
    let { taskId, toggleFn }: EditorProps = $props()


    // Gets the task from the task id. Through this method, changes in the state is updated properly
    const task: Task | null = $derived(taskStore.getList().find(t => t.id === taskId) || null);
</script>

{#if task != null}
    <section class="flex flex-col justify-between flex-1 border border-background-300 rounded-xl p-4">
        
    </section>
{/if}