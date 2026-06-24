<script lang="ts">
    import { taskMenu } from "@/components/ui/task/task-menu.svelte";
    import MenuRoot from "@/components/ui/layout/menu/root.svelte";
    import MenuTrigger from "@/components/ui/layout/menu/trigger.svelte";
    import Checkbox from "@/components/ui/inputs/checkbox.svelte";
    import { updateTaskComplete } from "@/lib/task/service";
    import { planners } from "@/lib/planner/store.svelte";
    import { formatLongDate } from "@/lib/shared/date";
    import { colors } from "@/components/util/color";
    import { type Task } from "@/lib/task/type";
    import { editor } from "../layout/editor/util.svelte";
    
    const MAX_DISPLAYED_PLANNERS = 5;

    interface ItemProps {
        task: Task
    }   

    let { task }: ItemProps = $props() 
</script>

<!-- On pressing ctrl+left click, you can select a list of tasks for the menu -->
<!-- On pressing left click, you can open the editor -->
<MenuRoot items={taskMenu.items}>
    <MenuTrigger 
        onLeftClick={(e) => {
            if (e.ctrlKey) {
                taskMenu.select(task)
            }
            else {
                editor.value == task.id ? editor.close() : editor.open(task.id)
            }
        }}
        onRightClick={() => taskMenu.open(task)}
        ariaLabel="Button to view details about '{task.name}'"
        triggerClasses="
            // {taskMenu.selectedTasks.has(task) ? 'border border-background-400' : 'border border-background-100'}
            flex items-center shrink-0 py-0.5 rounded-md cursor-pointer bg-background-50 hover:bg-background-100
            min-h-24 px-2 gap-2
            sm:min-h-22 sm:px-3 sm:gap-3
            lg:min-h-16
        "
    >
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
                        flex justify-center items-center truncate bg-{colors[taskPlanner.color]} rounded-md
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
    </MenuTrigger>
</MenuRoot>
