<script lang="ts">
    import TaskGroup from "@/components/ui/task/list/parts/task-group.svelte";
    import TaskItem from "@/components/ui/task/list/parts/task-item.svelte";
    import { tasks } from "@/lib/task/store.svelte";
    import { type Task } from "@/lib/task/type";

    // The list receives an optional task select function. If it exists, the function is passed to the TaskItem, 
    // so that on clicking the tasks leads to an action being done. 
    interface ListProps {
        onTaskSelect?: (task: Task) => void
    }
    
    let { onTaskSelect }: ListProps = $props()
</script>

<TaskGroup header="Incomplete Tasks">
    {#each tasks.incomplete as task (task.id)}
        <TaskItem 
            task={task} 
            onTaskSelect={onTaskSelect}
        />
    {/each}
</TaskGroup>

<TaskGroup header="Complete Tasks">
    {#each tasks.complete as task (task.id)}
        <TaskItem 
            task={task}
            onTaskSelect={onTaskSelect}
        />
    {/each}
</TaskGroup>