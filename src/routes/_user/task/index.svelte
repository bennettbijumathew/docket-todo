<!-- CODE: -->
<script lang="ts">
    import { authStore } from "@/lib/auth/store.svelte";
    import { taskStore } from "@/lib/task/store.svelte";
    import { plannerStore } from "@/lib/planner/store.svelte";
    import { type NewTaskData, type Task } from "@/lib/task/type";
    import { colors } from "@/components/util/color";
    import { ChevronDown, ChevronRight, ClipboardCheck, Notebook, Plus } from "@lucide/svelte";
    import { type Planner } from "@/lib/planner/type";
    import DatePicker from "@/components/ui/inputs/date-picker.svelte";
    import { getLocalTimeZone, Time, toCalendarDateTime, today } from "@internationalized/date";
    import PlannerPicker from "@/components/ui/inputs/planner-picker.svelte";
    import { formatLongDate } from "@/components/util/date";
    import { taskRepo } from "@/lib/task/repository";
    import { plannerRepo } from "@/lib/planner/repository";
    import TaskEditor from "@/components/ui/task/task-editor.svelte";
    import { routes } from "@/components/util/routes";

    // These variables are used to show the tasks of the user.
    const completeTasks: Task[] = $derived(taskStore.getList().filter((item) => item.completed === true))
    const incompleteTasks: Task[] = $derived(taskStore.getList().filter((item) => item.completed === false))

    // These variables are responsible for showing the incomplete and complete tasks.
    let isIncompleteTasksShown: boolean = $state(true)
    let isCompleteTasksShown: boolean = $state(false)


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
    // and the state of the edit modal being open
    let isEditModalOpen: boolean = $state(true)
    let selectedTask: Task | null = $state(null)

    // This function toggles the task editing modal.
    function toggleEditModal(task: Task | null) {
        // If the user clicks on the same task or the task doesn't exist
        // Then the modal is hidden from the users' view 
        if (selectedTask === task || task === null) {
            isEditModalOpen = false
            selectedTask = null
            return; 
        }

        // If the guard clauses are passed, then the new task is set with the view being open.
        selectedTask = task
        isEditModalOpen = true
    }
</script>


<!-- COMPONENT: This is task tile snippet that is used to show a single task -->
{#snippet taskTile(task: Task)}
    <button
        onclick={() => toggleEditModal(task)} 
        class="flex justify-between items-center h-13 hover:bg-background-50 cursor-pointer p-2"
    >
        <section class="flex items-center gap-x-1 text-left">
            <input 
                type="checkbox" 
                class="m-2 ml-0 size-4 accent-content-900"
                bind:checked={task.completed}
                onclick={() => taskRepo.editComplete(task.id, !task.completed)}
            >   

            <div>
                <h3 class="font-bold"> {task.name} </h3>
                <p class="text-sm"> Due Date: {formatLongDate(task.dueDate)} </p>
            </div>
        </section>

        <div class="flex gap-x-2">
            <span class="flex items-center">
                {#each plannerStore.getItemsById(task.planners, false) as taskPlanner}    
                    <div class="text-sm font-light bg-{colors[taskPlanner.color]} h-4 w-6"> </div>
                {/each}
            </span>
        </div>
    </button>
{/snippet}

<!-- COMPONENT: This is planner tile snippet that is used to show a single task in a list -->
{#snippet plannerTile(planner: Planner)}
    <button 
        class={`flex min-h-13 justify-between items-center border-l-10 border-${colors[planner.color]} hover:bg-background-50 transition-colors cursor-pointer`}
        onclick={() => plannerRepo.editUserVisibility(authStore.getUserId(), planner.id, !planner.users[authStore.getUserId()])}
    >
        <p class="ml-2"> {planner.name} </p>

        <input 
            type="checkbox" 
            id={planner.id} 
            checked={planner.users[authStore.getUserId()]} 
            class="m-2 size-4 accent-content-900"
        >   
    </button>
{/snippet}

<!-- COMPONENT: This is the snippet used to show a list of tasks -->
{#snippet listOfTasks(header: string, list: Task[], isTaskShown: boolean, setIsTaskShownFn: () => void)}
    <div>
        <button 
            onclick={setIsTaskShownFn}
            class="mb-2 flex w-fit px-2 gap-x-2 items-center border-b-2 border-background-100 hover:border-background-300 transition-colors cursor-pointer"
        >
            {#if isTaskShown == true}
                <ChevronDown class="size-4"/>
            {:else}
                <ChevronRight class="size-4"/>
            {/if}
            
            {header}
        </button>

        <!-- Shows a list of complete tasks -->
        <main class="flex flex-col divide-y-2 divide-background-100">
            {#if isTaskShown === true}  
                {#each list as task}
                    {@render taskTile(task)}
                {/each}
            {/if}
        </main>
    </div>
{/snippet}


<main class="flex-1 flex min-h-0">
    <aside class="flex flex-col justify-between border flex-1 p-4">
        <!-- Title and redirection back to the website's home  -->
        <h1 class="font-title text-2xl font-bold text-content-900 hover:text-content-600">
            <a 
                aria-label="Link to Docket's Homepage"
                href={routes.get("Home")}
            >
                Docket
            </a>
        </h1>

        <!-- Panel for navigating to different sections of the application.   -->
        <section>
            <h2 class="font-title font-semibold text-lg">
                Navigation
            </h2>

            <nav class="flex flex-col gap-y-0.5">
                <a 
                    class="flex items-center gap-x-2 p-1 rounded-md transition-colors bg-background-100 hover:cursor-default"
                    aria-label="Link to Tasks Page"
                    href={routes.get("Task")}
                > 
                    <ClipboardCheck class="size-4"/>

                    <p>Tasks</p>
                </a>

                <a 
                    class="flex items-center gap-x-2 p-1 rounded-md transition-colors bg-background hover:bg-background-50 hover:cursor-pointer"
                    aria-label="Link to Planners Page"
                    href={routes.get("Planner")}
                >
                    <Notebook class="size-4"/>
                    
                    <p>Planners</p>
                </a>
            </nav>
        </section>

        <section>
            <h2 class="font-title font-semibold text-lg">
                Planners
            </h2>
        </section>
    </aside>

    <section class="border flex-3">
        <p> test </p>
    </section>

    <aside class="border flex-1">
        <p> test </p>
    </aside>
</main>




<!-- VIEW: This is what is shown on the arrival of the page -->
<main class="flex-1 flex p-4 pt-0 gap-x-4 min-h-0 bg-background">
    <section class="flex-1 border border-background-300 rounded-xl p-4 flex flex-col min-h-0">
        <h2 class="font-default font-semibold text-xl text-center pb-4">Planner</h2>

        <!-- This area renders a list of planners, toggling planners changes the tasks shown -->
        <div class="flex flex-col flex-1 overflow-y-auto">
            {#each plannerStore.getList() as planner}
                {@render plannerTile(planner)}
            {/each}
        </div>
    </section>

    <section class="flex flex-col gap-y-4 flex-4 border border-background-300 rounded-xl p-4">
        <h2 class="font-default font-semibold text-xl text-center">Task</h2>

        <!-- This area renders a list of planners, toggling planners changes the tasks shown -->
        <div class="flex-1 flex flex-col min-h-0 gap-y-4 overflow-y-auto"> 
            {@render listOfTasks("Incomplete Tasks", incompleteTasks, isIncompleteTasksShown, () => isIncompleteTasksShown = !isIncompleteTasksShown)}
            {@render listOfTasks("Complete Tasks", completeTasks, isCompleteTasksShown, () => isCompleteTasksShown = !isCompleteTasksShown)}
        </div>

        <!-- This area is the place to add tasks -->
        <form
            class="flex border border-background-300 focus-within:outline focus-within:outline-background-500 rounded-lg p-1.5"
            onsubmit={(e) => { 
                e.preventDefault(); 
                addNewTask() 
            }}
        >
            <div class="flex-1 flex items-center">
                <button 
                    class="py-2 px-2 hover:bg-background-100 rounded-lg cursor-pointer mr-1" 
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

            <DatePicker bind:value={newTask.dueDate}/>

            <PlannerPicker bind:value={newTask.planners}/>
        </form>
    </section>

    <TaskEditor taskId={selectedTask?.id ?? null} toggleFn={() => toggleEditModal(selectedTask)}/>
</main>