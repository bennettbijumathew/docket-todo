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
    class="
        flex border-t border-background-300 p-4 gap-2
        flex-col
        sm:flex-row
    "
    onsubmit={(e) => { 
        e.preventDefault(); 
        addNewTask();
    }}
>
    <div class="flex flex-row flex-1 gap-x-2">
        <input 
            type="text"
            class="
                flex-1 px-1 rounded-lg hover:bg-background-100 outline-background-400
                h-10 order-first
                sm:h-8 sm:order-last
            "
            placeholder="Enter a new task.."
            bind:value={newTask.name}
            aria-required="true"
            required
        />

        <button 
            class="
                flex items-center justify-center bg-background-200 hover:bg-background-300 rounded-lg 
                size-10 order-last
                sm:size-8 sm:order-first
            "
            aria-label="Add New Task" 
            type="submit"
        >
            <Plus class="size-4"/>
        </button>
    </div>

    <div class="
        flex gap-x-2
        overflow-x-scroll
        sm:overflow-visible
    ">
        <PlannerPicker 
            bind:value={newTask.planners}
            triggerClass="                    
                bg-background-100 hover:bg-background-200 outline-background-400 rounded-lg py-1 px-2 
                h-14 w-48 flex-auto
                sm:h-8
            "
        />

        <DatePicker 
            bind:value={newTask.dueDate}
            triggerClass="
                bg-background-100 hover:bg-background-200 outline-background-400 rounded-lg py-1 px-2
                h-14 w-48
                sm:h-8
            "
        />
    </div>
</form>