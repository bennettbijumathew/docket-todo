<script lang="ts">
    import { type NewTaskData } from "@/lib/task/type";
    import { Plus } from "@lucide/svelte";
    import DatePicker from "@/components/ui/inputs/date-picker.svelte";
    import { getLocalTimeZone, Time, toCalendarDateTime, today } from "@internationalized/date";
    import PlannerPicker from "@/components/ui/inputs/planner-picker.svelte";
    import { taskRepo } from "@/lib/task/repository";
    import { SvelteSet } from "svelte/reactivity";

    // This variable is used to handle new tasks that come in from the inputs
    let newTask: NewTaskData = $state({
        name: "",
        planners: new SvelteSet(),
        dueDate: toCalendarDateTime(today(getLocalTimeZone()), new Time(0, 0))
    })
    
    // This is a function for adding a new task and resetting the inputs
    function addNewTask(): void {
        taskRepo.createTask(newTask);
        
        newTask.name = ""; 
        newTask.planners.clear(); 
        newTask.dueDate = toCalendarDateTime(today(getLocalTimeZone()), new Time(0, 0))
    }
</script>

<!-- This is a form that on submit adds a new task -->
<form
    class="
        block sticky bottom-8 shadow-lg/20 text-content-900 rounded-lg bg-background-50
        sm:flex sm:bottom-0
    "
    onsubmit={(e) => { 
        e.preventDefault(); 
        addNewTask() 
    }}
>
    <div class="
        flex-1 flex flex-row-reverse sm:flex-row items-center basis-full 
        p-1.5 pb-0
        sm:p-2"
    >
        <button 
            class="
                p-3 bg-background-100 hover:bg-background-200 rounded-lg cursor-pointer
                sm:p-1.5
            "
            aria-label="Add New Task" 
            type="submit"
        >
            <Plus class="size-4"/>
        </button>

        <input 
            type="text" 
            class="outline-none flex-1 pl-1.5 py-1.5 sm:py-0.5"
            placeholder="Enter a new task.."
            bind:value={newTask.name}
            aria-required="true"
            required
        >
    </div>

    <div class="flex overflow-x-scroll sm:overflow-x-visible p-1.5 gap-1.5">
        <DatePicker 
            bind:value={newTask.dueDate}
            buttonStyle="
                bg-background-100 hover:bg-background-200 justify-between h-full
                min-w-60 py-1 px-2  
                sm:min-w-54 sm:px-2 sm:py-0
            "
            pickerStyle="bg-background shadow-md"
        />

        <PlannerPicker 
            bind:value={newTask.planners}
            buttonStyle="
                bg-background-100 hover:bg-background-200 h-full min-w-60
                py-1 px-2
                sm:px-2 sm:py-0
            "
            pickerStyle="bg-background shadow-md"
        />
    </div>
</form>