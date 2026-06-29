<script lang="ts">
    import { getLocalTimeZone, Time, toCalendarDateTime, today } from "@internationalized/date";
    import PlannerPicker from "@/components/ui/inputs/planner-picker.svelte";
    import DatePicker from "@/components/ui/inputs/date-picker.svelte";
    import { type NewTaskData } from "@/lib/task/type";
    import { createTask } from "@/lib/task/service";
    import { SvelteSet } from "svelte/reactivity";
    import { Plus } from "@lucide/svelte";

    // This variable is used to handle new tasks that come in from the inputs
    let newTask: NewTaskData = $state({
        name: "",
        planners: new SvelteSet(),
        dueDate: toCalendarDateTime(today(getLocalTimeZone()), new Time(0, 0))
    })
    
    // This is a function for adding a new task and resetting the inputs
    function addNewTask(): void {
        createTask(newTask);
        
        newTask.name = ""; 
        newTask.dueDate = toCalendarDateTime(today(getLocalTimeZone()), new Time(0, 0))
    }
</script>

<!-- This is a form that on submit adds a new task -->
<form
    class="flex shrink-0 border-t border-background-300 p-4 gap-x-2"
    onsubmit={(e) => { 
        e.preventDefault(); 
        addNewTask();
    }}
>

    <div class="
        flex flex-row flex-1 bg-background-100 p-1 rounded-lg gap-2
        flex-wrap
        lg:flex-nowrap
    ">
        <input 
            type="text"
            class="min-h-8 flex-1 px-2 hover:bg-background-200 outline-background-400 rounded-lg"
            placeholder="Enter a new task.."
            bind:value={newTask.name}
            aria-required="true"
            required
        />
        
        <div class="
            flex gap-2 justify-end overflow-x-visible
            flex-1
            lg:flex-none
        ">
            <DatePicker 
                bind:value={newTask.dueDate}
                buttonStyle="
                    border border-background-300 hover:border-background-400 outline-background-400 rounded-lg p-1 text-right
                    w-full flex-1
                    lg:w-70 lg:flex-none
                "
                pickerStyle="bg-background shadow-md"
            />

            <PlannerPicker 
                bind:value={newTask.planners}
                triggerClass="                    
                    border border-background-300 hover:border-background-400 outline-background-400 rounded-lg p-1 
                    w-full flex-1
                    lg:w-70 lg:flex-none
                "
            />
        </div>
    </div>

    <button 
        class="
            flex items-center justify-center bg-background-100 hover:bg-background-200 rounded-lg 
            w-14
            sm:w-12
            lg:w-10
        "
        aria-label="Add New Task" 
        type="submit"
    >
        <Plus class="size-4"/>
    </button>
</form>