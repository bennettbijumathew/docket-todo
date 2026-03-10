<script lang="ts">
    import { taskRepo } from "@/lib/task/repository";
    import { taskStore } from "@/lib/task/store.svelte";
    import { type Task } from "@/lib/task/type";
    import { getLocalTimeZone, Time, toCalendarDateTime, today } from "@internationalized/date";
    import { Trash } from "@lucide/svelte";
    import DatePicker from "../../inputs/date-picker.svelte";
    import TaskPlannersPicker from "../../inputs/task-planners-picker.svelte";
    import { type TaskPlanner } from "@/lib/planner/type";

    // The component receives the selected task id with a function that 
    // closes the editor. 
    interface EditorProps {
        taskId: string | null, 
        onClose?: () => void,
    }
    
    let { taskId, onClose }: EditorProps = $props()


    // Gets the task from the task id. Through this method, changes in the state is updated properly
    const task: Task | null = $derived(taskStore.getList().find(t => t.id === taskId) || null);


    // Inputs of this editor are initialized with effect used to 
    // ensure that inputs are synced with the state variables.
    let inputs = $state({
        name: "", 
        dueDate: toCalendarDateTime(today(getLocalTimeZone()), new Time(0, 0))
    })

    $effect(() => {
        if (task) {
            inputs.name = task.name
            inputs.dueDate = task.dueDate
        }
    })


    // Functions to update the task' name
    function submitNameChange() {
        // Doesn't edit the name if task doesn't exist or if input and task names are the same
        if (task === null || task.name === inputs.name || inputs.name.trim() === "" ) {
            return 
        }

        taskRepo.editName(task.id, inputs.name) 
    }

    // Function to update a change in the task's planners
    function submitPlannerChange(taskPlanner: TaskPlanner | null) {
        if (taskPlanner === null || task === null) { 
            return;
        }

        if (taskPlanner.selected) {
            taskRepo.removePlannerFromTask(task.id, taskPlanner.id);
        } 
        else {
            taskRepo.addPlannerToTask(task.id, taskPlanner.id);
        }
    }

    // Functions to update the planners' name
    function submitDateChange() {
        // Doesn't edit the name if planner doesn't exist or if input and planner names are the same
        if (task === null) {
            return 
        }
        
        taskRepo.editDate(task.id, inputs.dueDate) 
    }

    // Functions to delete the planner
    function submitDeletionOfTask(taskId: string | null) {
        // // Doesn't delete the planner if planner doesn't exist
        if (task === null || taskId == null) {
            return 
        }

        // Deletes the task using the task id.
        taskRepo.deleteTask(taskId) 

        // Closes the sidebar using the 
        onClose?.()
    }

</script>

{#if task != null}
    <div class="flex flex-col gap-y-4">
        <!-- Form to update name changes for the task -->
        <form 
            onsubmit={(e) => { 
                e.preventDefault(); 
                submitNameChange();
            }}
        >
            <p class="font-bold">Title</p>
            <input 
                type="text" 
                class="bg-background-50 hover:bg-background-100 focus:bg-background-200 outline-none rounded-lg p-1 px-1.5 w-full shadow-md"
                bind:value={inputs.name}
                onblur={submitNameChange}
            >
        </form>

        <!-- Date picker for the task's due date -->
        <div>
            <p class="font-bold">Due Date</p>
            <DatePicker 
                bind:value={inputs.dueDate}
                buttonStyle="bg-background-50 hover:bg-background-100 shadow-md rounded-lg p-1 px-1.5 w-full"
                pickerStyle="bg-background shadow-md"
                onChangeFn={() => submitDateChange()}
            />
        </div>

        <!-- Planner picker for the task's connected planner -->
        <div>
            <p class="font-bold">Planners</p>
            <TaskPlannersPicker 
                task={task} 
                onChangeFn={(planner) => submitPlannerChange(planner)}
                buttonStyle="bg-background-50 hover:bg-background-100 shadow-md"
                pickerStyle="bg-background shadow-md"
            />
        </div>
    </div>

    <div class="text-center">
        <!-- Delete button for the task -->
        <button 
            class="p-2 bg-background-50 hover:bg-background-100 shadow-md rounded-lg cursor-pointer"
            onclick={() => submitDeletionOfTask(task?.id ?? null)}
        >   
            <Trash class="size-4"/>
        </button>
    </div>
{:else}
    <div class="flex flex-col flex-1 justify-center items-center">
        <h2 class="font-title font-semibold text-md"> Error Found </h2>
        <p> Can't edit the selected item.</p>
    </div>
{/if}