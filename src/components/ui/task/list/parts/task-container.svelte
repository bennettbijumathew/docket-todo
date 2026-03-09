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

<section class="flex flex-col flex-3 p-8 inset-shadow-b-md sm:inset-shadow-l-md">
    <h2 class="font-title font-semibold text-lg"> Task </h2>

    <!-- This area renders the children element that is given by the caller -->
    <!-- This would usually hold a group of tasks -->
    <div class="
        flex-1 flex flex-col overflow-y-scroll pr-4 my-6 gap-y-4
        scrollbar scrollbar-w-2 scrollbar-thumb-content-900 scrollbar-thumb-rounded-md scrollbar-track-transparent
    ">      
        {@render taskGroup()}
    </div>

    <!-- This area is the place to add tasks -->
    <form
        class="flex gap-x-2 bg-background-50 text-content-900 focus-within:bg-background-100 rounded-lg p-1.5 shadow-md"
        onsubmit={(e) => { 
            e.preventDefault(); 
            addNewTask() 
        }}
    >
        <div class="flex-1 flex items-center">
            <button 
                class="py-2 px-2 hover:bg-background-100 rounded-lg cursor-pointer mr-1"
                aria-label="Add New Task" 
                type="submit"
            >
                <Plus class="size-4"/>
            </button>

            <input 
                type="text" 
                class="outline-none flex-1"
                placeholder="Enter a new task.."
                bind:value={newTask.name}
                aria-required="true"
                required
            >
        </div>

        <DatePicker 
            bind:value={newTask.dueDate}
            buttonStyle="bg-background-100 hover:bg-background-200 px-2 min-w-54 justify-between"
            pickerStyle="bg-background shadow-md"
        />

        <PlannerPicker 
            bind:value={newTask.planners}
            buttonStyle="bg-background-100 hover:bg-background-200 px-2 justify-between"
            pickerStyle="bg-background shadow-md"
        />
    </form>
</section>
