<script lang="ts">
    import MenuTrigger from "@/components/ui/layout/menu/trigger.svelte";
    import { editor } from "@/components/ui/layout/editor/util.svelte";
    import { taskMenu } from "@/components/ui/task/task-menu.svelte";
    import MenuRoot from "@/components/ui/layout/menu/root.svelte";
    import Checkbox from "@/components/ui/inputs/checkbox.svelte";
    import { updateTaskComplete } from "@/lib/task/service";
    import { planners } from "@/lib/planner/store.svelte";
    import { formatLongDate } from "@/lib/shared/date";
    import { type Planner } from "@/lib/planner/type";
    import { colors } from "@/components/util/color";
    import { type Task } from "@/lib/task/type";
    import { fly } from "svelte/transition";
    import { Popover } from "bits-ui";

    interface ItemProps {
        task: Task
    }   
    
    let { task }: ItemProps = $props() 
    const MAX_DISPLAYED_PLANNERS = 5;

    /** A list of planners that are related to the task. It is sorted by visible first, then alphabetical. */
    let taskPlanners = $derived(
        planners.all.filter((item) => task.planners.has(item.id)).sort((a, b) => {
            if (a.visible !== b.visible) {
                return Number(b.visible) - Number(a.visible);
            }

            return 0;
        })

    )

    /** This is a list of the task's associated planners that is shown in the user interface. */
    let displayedPlanners = $derived(
        taskPlanners.slice(0, MAX_DISPLAYED_PLANNERS)
    )

    /** This is a list of the task's associated planners that is hidden from the user interface. */
    let concealedPlanners = $derived(
        taskPlanners.slice(MAX_DISPLAYED_PLANNERS, taskPlanners.length)
    )
</script>


{#snippet plannerTile(task: Task, planner: Planner)}
    <div
        aria-label="'{task.name}' is associated with the planner called '{planner.name}'"
        class="flex items-center w-20 h-5 py-0.5 px-1 gap-x-1 rounded-md border border-background-400 cursor-default"
    >
        <div
            aria-label="{planner.name} is {planner.visible ? 'visible' : 'hidden'}"
            class="
                {planner.visible ? `bg-${colors[planner.color]}` : `border border-${colors[planner.color]}`}
                size-2 rounded-sm box-border shrink-0
            "
        >
        </div>

        <p class="flex-1 min-w-0 truncate text-xs">
            {planner.name}
        </p>
    </div>      
{/snippet}

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
            {taskMenu.selectedTasks.has(task) ? 'border border-background-400' : 'border border-background-100'}
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
            ariaLabel="Checkbox to mark the task '{task.name}' as {task.completed ? "complete" : "incomplete"}"
            checkedStyle="size-6 bg-content-900 text-background"
            unCheckedStyle="size-6 border-content-900"
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

            {#each displayedPlanners as planner}
                {@render plannerTile(task, planner)}
            {/each}

            {#if concealedPlanners.length > 0}
                <Popover.Root>
                    <Popover.Trigger 
                        class="
                            flex justify-center items-center truncate rounded-md border border-background-400 cursor-pointer
                            text-xs w-20 h-5 px-0.5 gap-x-1
                            lg:w-6
                        "
                        openOnHover={true}
                        aria-label="A hover button to show {concealedPlanners.length} concealed planners"
                    >
                        +{concealedPlanners.length}
                    </Popover.Trigger>

                    <Popover.Content 
                        class="flex flex-col gap-1 rounded-md bg-background border border-background-400 shadow-md p-1 cursor-default" 
                        forceMount={true}
                    >
                        {#snippet child({ wrapperProps, props, open })}
                            {#if open}
                                <div {...wrapperProps}>
                                    <div {...props} transition:fly={{duration: 300}}>
                                        
                                        <Popover.Arrow class="text-background-400"/>
        
                                        {#each concealedPlanners as planner}
                                            {@render plannerTile(task, planner)}
                                        {/each}
                                    </div>
                                </div>
                            {/if}
                        {/snippet}
                    </Popover.Content>
                </Popover.Root>
            {/if}
        </div>
    </MenuTrigger>
</MenuRoot>
