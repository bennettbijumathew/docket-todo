<script lang="ts">
    import { plannerStore } from "@/lib/planner/store.svelte";
    import { type Task } from "@/lib/task/type";
    import { colors } from "@/components/util/color";
    import { Calendar } from "@lucide/svelte";
    import { formatLongDate } from "@/components/util/date";
    import { taskRepo } from "@/lib/task/repository";
    import Checkbox from "@/components/ui/inputs/checkbox.svelte";

    // The item receives the task's details and a optional function that can be used by the caller. 
    interface ItemProps {
        task: Task
        onTaskSelect?: (task: Task) => void
    }   

    let { task, onTaskSelect }: ItemProps = $props() 
</script>

<!-- On clicking the container, the task select function is called. -->
<button
    onclick={() => onTaskSelect?.(task)} 
    class="flex justify-between items-center bg-background-50 hover:bg-background-100 cursor-pointer py-2 px-3 rounded-lg gap-x-2"
    aria-label="Button to open the editor for the task of '{task.name}'" 
>
    <div class="flex items-center gap-x-3 text-left">
        <!-- On clicking the checkbox, the task is toggled to the opposite of its current value -->
        <Checkbox 
            value={task.completed}
            onChangeFn={() => { 
                taskRepo.editComplete(task.id, !task.completed) 
            }}
            stopPropagation={true}
        />
        
        <div>
            <h3 class="font-bold"> {task.name} </h3>
            
            <span class="flex items-center justify-center gap-x-1">
                <Calendar class="size-3"/>
                
                <p class="text-sm"> Due Date: {formatLongDate(task.dueDate)} </p>
            </span>
        </div>
    </div>

    <!-- This is a list of planners colors related to the task -->
    <div class="
        rounded-sm overflow-hidden bg-background-200
        grid grid-cols-5 grid-rows-2
        lg:flex sm:items-center sm:bg-transperant
    ">
        {#each plannerStore.getItemsById(task.planners, false) as taskPlanner}    
            <div class="flex items-center justify-center w-6 bg-{colors[taskPlanner.color]}"> 
                <p class="m-0.5 text-xs font-medium"> {taskPlanner.name[0]} </p>
            </div>
            <div class="flex items-center justify-center w-6 bg-{colors[taskPlanner.color]}"> 
                <p class="m-0.5 text-xs font-medium"> {taskPlanner.name[0]} </p>
            </div>
        {/each}
    </div>
</button>
