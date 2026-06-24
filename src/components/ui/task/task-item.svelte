<script lang="ts">
    import { updateTaskComplete } from "@/lib/task/service";
    import { type Task } from "@/lib/task/type";
    import Checkbox from "@/components/ui/inputs/checkbox.svelte";
    import { planners } from "@/lib/planner/store.svelte";
    import { formatLongDate } from "@/lib/shared/date";
    import { colors } from "@/components/util/color";

    const MAX_DISPLAYED_PLANNERS = 5;

    interface ItemProps {
        task: Task
    }   

    let { task }: ItemProps = $props() 

</script>

<Checkbox 
    value={task.completed}
    onChangeFn={() => { 
        updateTaskComplete({
            id: task.id, 
            complete: !task.completed
        }) 
    }}
    stopPropagation={true}
    checkedStyle="size-7 bg-content-900 text-background"
    unCheckedStyle="size-7 border-content-900"
/>

<div class="flex-3 text-left justify-items-start"> 
    <h2 class=""> {task.name} </h2>
    <p class="text-sm"> {formatLongDate(task.dueDate)}</p>
</div>

<div class="
    flex flex-wrap gap-2 justify-end 
    max-w-50 
    sm:max-w-70
    lg:max-w-none
">

    {#each [...task.planners].slice(0, MAX_DISPLAYED_PLANNERS) as plannerId}
        {@const taskPlanner = planners.visible.find((item) => item.id == plannerId)}

        {#if taskPlanner != undefined}
            <div class="
                flex items-center border truncate bg-{colors[taskPlanner.color]}
                text-xs w-20 h-5 px-0.5
                sm:text-sm sm:w-22 sm:h-7 sm:px-1
            ">
                {taskPlanner.name}
            </div>
        {/if}
    {/each}

    {#if task.planners.size > MAX_DISPLAYED_PLANNERS}
        <div class="
            flex items-center border truncate 
            text-xs w-20 h-5 px-0.5
            sm:text-sm sm:w-22 sm:h-7 sm:px-1
            lg:w-auto 
        ">
            +{task.planners.size - MAX_DISPLAYED_PLANNERS}
        </div>
    {/if}
</div>