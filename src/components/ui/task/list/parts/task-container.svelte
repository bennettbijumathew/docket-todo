<script lang="ts">
    import { type NewTaskData } from "@/lib/task/type";
    import { Plus } from "@lucide/svelte";
    import DatePicker from "@/components/ui/inputs/date-picker.svelte";
    import { getLocalTimeZone, Time, toCalendarDateTime, today } from "@internationalized/date";
    import PlannerPicker from "@/components/ui/inputs/planner-picker.svelte";
    import { taskRepo } from "@/lib/task/repository";
    import { type Snippet } from "svelte";

    // These props are received from the caller using the component. 
    // A child element is given so that it can be rendered later.
    interface ContainerProps {
        children: Snippet,
    }

    let { children: taskGroup }: ContainerProps = $props() 

    // This variable is used to handle new tasks that come in from the inputs
    let newTask: NewTaskData = $state({
        name: "",
        planners: [],
        dueDate: toCalendarDateTime(today(getLocalTimeZone()), new Time(0, 0))
    })
    
    // This is a function for adding a new task and resetting the inputs
    function addNewTask(): void {
        taskRepo.createTask(newTask)
        
        newTask = {
            name: "",
            planners: [],
            dueDate: toCalendarDateTime(today(getLocalTimeZone()), new Time(0, 0))
        }
    }
</script>

<!-- This area renders the children element that is given by the caller -->
<!-- This would usually hold a group of tasks -->
<div class="
    flex-1 flex flex-col overflow-y-scroll gap-y-4 my-6
    sm:max-h-none
    scrollbar scrollbar-w-2 scrollbar-thumb-content-900 scrollbar-thumb-rounded-md scrollbar-track-transparent
">      
    {@render taskGroup()}
</div>

<!-- This area is the place to add tasks -->
<form
    class="
        sticky bottom-6 shadow-lg/20 text-content-900 rounded-lg bg-background
        block 
        sm:flex
    "
    onsubmit={(e) => { 
        e.preventDefault(); 
        addNewTask() 
    }}
>
    <div class="flex-1 flex flex-row-reverse sm:flex-row items-center basis-full p-1.5">
        <button 
            class="
                p-3 bg-background-50 hover:bg-background-200 rounded-lg cursor-pointer
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
                bg-background-100 hover:bg-background-200 justify-between
                min-w-60 py-1 px-2  
                sm:min-w-54 sm:px-2 sm:py-0
            "
            pickerStyle="bg-background shadow-md"
        />

        <PlannerPicker 
            bind:value={newTask.planners}
            buttonStyle="
                bg-background-100 hover:bg-background-200 justify-between
                min-w-60 py-1 px-2
                sm:min-w-54 sm:px-2 sm:py-0
            "
            pickerStyle="bg-background shadow-md"
        />
    </div>

</form>