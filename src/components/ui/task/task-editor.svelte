<script lang="ts">
    import { taskRepo } from "@/lib/task/repository";
    import { taskStore } from "@/lib/task/store.svelte";
    import { type Task } from "@/lib/task/type";
    import { getLocalTimeZone, Time, toCalendarDateTime, today } from "@internationalized/date";
    import { X } from "@lucide/svelte";
    import DatePicker from "../inputs/date-picker.svelte";

    // The component receives the selected task id with a function that 
    // handles the behavior of the open and close state of the editor. 
    interface EditorProps {
        taskId: string | null, 
        toggleFn: () => void
    }
    
    let { taskId, toggleFn }: EditorProps = $props()


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

    
    // Functions to update the planners' name
    function submitNameChange() {
        // Doesn't edit the name if planner doesn't exist or if input and planner names are the same
        if (task === null || task.name === inputs.name || inputs.name.trim() === "" ) {
            return 
        }

        taskRepo.editName(task.id, inputs.name) 
    }
</script>

{#if task != null}
    <section class="flex flex-col justify-between flex-1 border border-background-300 rounded-xl p-4">
        <div class="flex flex-col gap-y-4">
            <div class="flex justify-between items-center pb-1">
                <h2 class="font-default font-semibold text-xl text-center">Edit Task</h2>

                <button 
                    class="p-2 border border-background-300 hover:bg-background-100 rounded-lg cursor-pointer"
                    onclick={toggleFn}
                >   
                    <X class="size-4"/>
                </button>
            </div>

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
                    class="border border-background-300 rounded-lg p-1 w-full"
                    bind:value={inputs.name}
                    onblur={submitNameChange}
                >
            </form>

            <div>
                <p class="font-bold">Due Date</p>
                <DatePicker 
                    bind:value={inputs.dueDate}
                    buttonClass="border border-background-300 rounded-lg p-1 px-1.5 w-full"
                />
            </div>
        </div>
    </section>
{/if}