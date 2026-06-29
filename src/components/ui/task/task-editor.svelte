<script lang="ts">
    import { type Task } from "@/lib/task/type";
    import { getLocalTimeZone, Time, toCalendarDateTime, today } from "@internationalized/date";
    import { Trash, X } from "@lucide/svelte";
    import DatePicker from "@/components/ui/inputs/date-picker.svelte";
    import TaskPlannersPicker from "@/components/ui/inputs/task-planners-picker.svelte";
    import { addPlannerToTask, removePlannerFromTask, removeTask, updateTaskDate, updateTaskName } from "@/lib/task/service";
    import { tasks } from "@/lib/task/store.svelte";
    import { fade } from "svelte/transition";
    import EditorRoot from "@/components/ui/layout/editor/root.svelte";
    import { editor } from "@/components/ui/layout/editor/util.svelte";

    /** A local reference for the current task id */
    let activeId = $state<string | null>(null);

    /** The active task id is updated based on the */
    $effect(() => {
        if (editor.value !== null) {
            activeId = editor.value;
        } 
        /** When editor closes completely, wait for transitions or clear immediately */
        else {
            activeId = null;
        }
    });

    /** Gets the task that is derived from the current task id. */
    const task: Task | null = $derived.by(() => {
        if (!activeId) { 
            return null 
        };
        
        return tasks.get({ id: activeId });
    });

    /** Inputs of this editor are initialized with effect used to 
    ensure that inputs are synced with the state variables. */ 
    let inputs = $state({
        name: "", 
        dueDate: toCalendarDateTime(today(getLocalTimeZone()), new Time(0, 0))
    });

    $effect(() => {
        if (task) {
            inputs.name = task.name;
            inputs.dueDate = task.dueDate;
        }
    });
</script>

<EditorRoot>
    <!-- Header that shows title and close button -->
    <header 
        class="
            flex items-center border-b border-background-300 p-4 pt-0 shrink-0 gap-2
        "
    >   
        <!-- Close button -->
        <button 
            onclick={editor.close}
            aria-label="Hide the task editor"
            class="flex items-center justify-center bg-background-100 hover:bg-background-200 rounded-lg cursor-pointer size-8"
        >      
            <X class="size-4"/>
        </button>

        <!-- Title -->
        <h1 class="font-title font-semibold text-lg"> Edit Task </h1>
    </header>

    <!-- Task details are shown here. -->
    {#if task}    
        <div 
            class="flex flex-col flex-1 gap-y-4 p-4"
            transition:fade={{duration: 200}} 
            
        >
            <!-- Form to update name changes for the task -->
            <form 
                onsubmit={(e) => { 
                    e.preventDefault(); 

                    updateTaskName({
                        id: task.id, 
                        name: inputs.name
                    });
                }}
            >
                <p class="font-bold">Title</p>
                <input 
                    type="text" 
                    class="bg-background-50 hover:bg-background-100 focus:bg-background-200 outline-none rounded-lg p-1 px-1.5 w-full shadow-md"
                    bind:value={inputs.name}
                    onblur={() => {
                        updateTaskName({
                            id: task.id, 
                            name: inputs.name
                        })
                    }}
                >
            </form>

            <!-- Date picker for the task's due date -->
            <div>
                <p class="font-bold">Due Date</p>

                <DatePicker 
                    bind:value={inputs.dueDate}
                    buttonStyle="bg-background-50 hover:bg-background-100 shadow-md rounded-lg p-1 px-1.5 w-full"
                    pickerStyle="bg-background shadow-md"
                    onChangeFn={() => {
                        updateTaskDate({
                            id: task.id, 
                            date: inputs.dueDate
                        })
                    }}
                />
            </div>

            <!-- Planner picker for the task's associated planner list -->
            <div>
                <p class="font-bold">Planners</p>

                <TaskPlannersPicker 
                    task={task} 
                    addPlannerFn={(plannerId) => { 
                        addPlannerToTask({
                            taskId: task.id, 
                            newPlannerId: plannerId
                        }) 
                    }}
                    removePlannerFn={(plannerId) => { 
                        removePlannerFromTask({
                            taskId: task.id, 
                            oldPlannerId: plannerId
                        })
                    }}
                    buttonStyle="bg-background-50 hover:bg-background-100 shadow-md"
                    pickerStyle="bg-background shadow-md"
                />
            </div>
        </div>

        <!-- Delete button for the task -->
        <div class="text-center pb-6 p-4">
            <button 
                class="p-2 bg-background-50 hover:bg-background-100 shadow-md rounded-lg cursor-pointer"
                onclick={() => {
                    removeTask({
                        id: task.id
                    }) 

                    editor.close()
                }}
            >   
                <Trash class="size-4"/>
            </button>
        </div>
    {:else if activeId == ""}
        <div class="flex flex-1 justify-center items-center">
            <h2 class="font-title"> Task could not be found. </h2>
        </div>
    {/if}
</EditorRoot>