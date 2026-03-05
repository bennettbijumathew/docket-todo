<!-- CODE -->
<script lang="ts">
    import { taskStore } from "@/lib/task/store.svelte";
    import { plannerStore } from "@/lib/planner/store.svelte";
    import { type NewTaskData, type Task } from "@/lib/task/type";
    import { colors } from "@/components/util/color";
    import { Calendar, ChevronDown, ChevronRight, Plus } from "@lucide/svelte";
    import DatePicker from "@/components/ui/inputs/date-picker.svelte";
    import { getLocalTimeZone, Time, toCalendarDateTime, today } from "@internationalized/date";
    import PlannerPicker from "@/components/ui/inputs/planner-picker.svelte";
    import { formatLongDate } from "@/components/util/date";
    import { taskRepo } from "@/lib/task/repository";
    import TaskEditor from "@/components/ui/task/task-editor.svelte";
    import Checkbox from "@/components/ui/inputs/checkbox.svelte";
    import TaskSidebar from "@/components/ui/task/task-sidebar.svelte";

    // These variables are used to show the tasks of the user.
    const completeTasks: Task[] = $derived(taskStore.getList().filter((item) => item.completed === true))
    const incompleteTasks: Task[] = $derived(taskStore.getList().filter((item) => item.completed === false))

    // These variables are responsible for showing the incomplete and complete tasks.
    let isIncompleteTasksShown: boolean = $state(true)
    let isCompleteTasksShown: boolean = $state(true)


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


    // These variables represent the current planner that is open on the modal
    let selectedTask: Task | null = $state(null)

    // This function toggles the task editing modal.
    function toggleEditModal(task: Task | null) {
        // If the user clicks on the same task or the task doesn't exist
        // Then the modal is hidden from the users' view 
        if (selectedTask === task || task === null) {
            selectedTask = null
            return; 
        }

        // If the guard clauses are passed, then the new task is set with the view being open.
        selectedTask = task
    }
</script>

<!-- COMPONENT: This is task tile snippet that is used to show a single task -->
{#snippet taskTile(task: Task)}
    <!-- On clicking the container, the task modal is opened. -->
    <button
        onclick={() => toggleEditModal(task)} 
        class="flex justify-between items-center bg-background-50 hover:bg-background-100 cursor-pointer py-2 px-3 rounded-lg"
        aria-label="Button to open the editor for the task of '{task.name}'" 
    >
        <div class="flex items-center gap-x-3 text-left">
            <!-- On clicking the checkbox, the task is toggled to the opposite of its current value -->
            <Checkbox 
                value={task.completed}
                onChangeFn={() => { 
                    taskRepo.editComplete(task.id, !task.completed) 
                }}
                stopPropagation={true}
            />
            
            <div>
                <h3 class="font-bold"> {task.name} </h3>
                
                <span class="flex items-center justify-center gap-x-1">
                    <Calendar class="size-3"/>
                    
                    <p class="text-sm"> Due Date: {formatLongDate(task.dueDate)} </p>
                </span>
            </div>
        </div>

        <!-- This is a list of planners colors related to the task -->
        <div class="flex items-center rounded-sm overflow-hidden">
            {#each plannerStore.getItemsById(task.planners, false) as taskPlanner}    
                <div class="inline-flex items-center justify-center w-6 bg-{colors[taskPlanner.color]}"> 
                    <p class="m-0.5 text-xs font-medium"> {taskPlanner.name[0]} </p>
                </div>
            {/each}
        </div>
    </button>
{/snippet}


<!-- COMPONENT: This is the snippet used to show a list of tasks -->
{#snippet listOfTasks(header: string, list: Task[], isTaskShown: boolean, setIsTaskShownFn: () => void)}
    <div>
        <!-- This toggles the list of tasks from the users' view -->
        <button 
            onclick={setIsTaskShownFn}
            class="flex items-center mb-2 gap-x-2 cursor-pointer hover:border-background-200 border-b border-background-50 transition-colors"
            aria-label="Button to toggle '{header}'" 
        >
            <h3 class="font-title text-md"> {header} </h3>

            {#if isTaskShown == true}
                <ChevronDown class="size-4"/>
            {:else}
                <ChevronRight class="size-4"/>
            {/if}
        </button>

        <!-- Shows a list of complete tasks -->
        {#if isTaskShown === true}  
            <main class="flex flex-col gap-y-2">
                {#each list as task}
                    {@render taskTile(task)}
                {/each}
            </main>
        {/if}
    </div>
{/snippet}


<main class="flex flex-col flex-1 sm:min-h-0 sm:flex-row inset-shadow-b-md sm:inset-shadow-none">
    <!-- This shows a sidebar with a navigation bar and a planner list that can be toggled. -->
    <TaskSidebar/>

    <section class="flex flex-col flex-3 py-6 px-8 inset-shadow-b-md sm:inset-shadow-l-md">
        <h2 class="font-title font-semibold text-lg"> Task </h2>

        <!-- This area renders a list of planners, toggling planners changes the tasks shown -->
        <div class="
            flex-1 flex flex-col overflow-y-scroll pr-4 my-6 gap-y-4
            scrollbar scrollbar-w-2 scrollbar-thumb-content-900 scrollbar-thumb-rounded-md scrollbar-track-transparent
        "> 
            {@render listOfTasks("Incomplete Tasks", incompleteTasks, isIncompleteTasksShown, () => isIncompleteTasksShown = !isIncompleteTasksShown)}
            {@render listOfTasks("Complete Tasks", completeTasks, isCompleteTasksShown, () => isCompleteTasksShown = !isCompleteTasksShown)}
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

    <TaskEditor 
        taskId={selectedTask?.id ?? null} 
        toggleFn={() => toggleEditModal(selectedTask)}
        editorStyle="bg-background p-6 inset-shadow-l-md"
    />
</main>