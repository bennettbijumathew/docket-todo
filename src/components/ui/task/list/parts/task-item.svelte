<script lang="ts">
    import { planners } from "@/lib/planner/store.svelte";
    import { type Task } from "@/lib/task/type";
    import { colors } from "@/components/util/color";
    import { Calendar } from "@lucide/svelte";
    import { formatLongDate } from "@/lib/shared/date";
    import { MAX_PLANNERS } from "@/lib/task/repository";
    import Checkbox from "@/components/ui/inputs/checkbox.svelte";
    import { updateTaskComplete } from "@/lib/task/service";

    // The item receives the task's details and a optional function that can be used by the caller. 
    interface ItemProps {
        task: Task
        onTaskSelect?: (task: Task) => void
    }   

    let { task, onTaskSelect }: ItemProps = $props() 

    // Gets a list of 10 visible planners that are related to the task
    let taskPlanners = $derived(
        planners.getItemsById({
            idList: task.planners, 
            includeHidden: false
        }).slice(0, MAX_PLANNERS)
    )

    // The minimum number of slots shown on the row of the task's planner grid.
    let colsInPlannerRow = MAX_PLANNERS / 2
</script>

<!-- On clicking the container, the task select function is called. -->
<button
    onclick={() => onTaskSelect?.(task)} 
    class="
        flex justify-between items-center bg-background-50 hover:bg-background-100 cursor-pointer py-1 px-3 rounded-lg gap-x-1
        sm:py-2 sm:px-3 sm:gap-x-2
    "
    aria-label="Button to open the editor for the task of '{task.name}'" 
>
    <div class="flex items-center gap-x-3 text-left">
        <!-- On clicking the checkbox, the task is toggled to the opposite of its current value -->
        <Checkbox 
            value={task.completed}
            onChangeFn={() => { 
                updateTaskComplete({
                    id: task.id, 
                    complete: !task.completed
                }) 
            }}
            stopPropagation={true}
            checkedStyle="size-6 bg-content-900 text-background"
            unCheckedStyle="size-6 border-content-900"

        />
        
        <div>
            <h3 class="font-bold"> {task.name} </h3>
            
            <span class="flex items-center justify-center gap-x-1">
                <Calendar class="size-3 hidden sm:block"/>
                
                <p class="text-sm"> Due Date: {formatLongDate(task.dueDate)} </p>
            </span>
        </div>
    </div>
    
    <div class="
        grid grid-cols-5 grid-rows-1 *:rounded-xs *:size-2.5 gap-x-2 gap-y-1
        sm:*:size-5 sm:*:rounded-sm sm:w-auto sm:gap-0.5
        lg:grid-cols-10 lg:grid-rows-1
    ">
        {#each {length: MAX_PLANNERS - taskPlanners.length}, slotNum}
            <!-- This logic ensures that multiple rows aren't shown beyond the amount that is required -->
            {#if slotNum < colsInPlannerRow && taskPlanners.length <= colsInPlannerRow}
                <!-- The styling hides slots based on the user using medias such as phones or tablets -->
                <div class="
                    hidden border border-background-300 border-dotted
                    lg:block
                "> </div>
            {:else}
                <div class="border border-background-300 border-dotted"> </div>
            {/if}
        {/each}

        {#each taskPlanners as taskPlanner}    
            <div class="flex items-center justify-center bg-{colors[taskPlanner.color]}"> 
                <p class="
                    hidden text-xs font-medium leading-none
                    sm:block
                "> 
                    {taskPlanner.name[0]} 
                </p>
            </div>
        {/each}
    </div>
</button>
