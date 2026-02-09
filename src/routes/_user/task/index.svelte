<script lang="ts">
    import { authStore } from "@/lib/auth/store.svelte";
    import { taskStore } from "@/lib/task/store.svelte";
    import { plannerStore } from "@/lib/planner/store.svelte";
    import { plannerTaskController } from "@/lib/planner-task/controller";
    import { type Task } from "@/lib/task/type";
    import dayjs from "dayjs";
    import { colors } from "@/lib/helpers/color";
    import PlannerSelect from "@/components/planner/planner-select.svelte";

    let editModalOpen = $state(true)
    let editedTask: Task | null = $state(null)

    function showTask(task: Task | null) {
        if (editedTask === task || task === null) {
            editModalOpen = false
            editedTask = null
            return; 
        }

        editedTask = task
        editModalOpen = true
    }
</script>

<main class="flex-1 flex p-4 pt-0 gap-x-4 min-h-0">
    <section class="flex-1 border border-background-300 rounded-xl p-4 flex flex-col min-h-0">
        <h2 class="font-default font-semibold text-xl text-center pb-4">Planner</h2>

        <div class="flex flex-col flex-1 overflow-y-auto">
            {#each plannerStore.getList() as planner}
                <button 
                    class={`flex min-h-10 justify-between items-center border-l-10 border-${colors[planner.color]} hover:bg-background-50 transition-colors cursor-pointer`}
                    onclick={() => plannerTaskController.updatePlannerVisibility(authStore.getUserId(), planner.id, !planner.users[authStore.getUserId()])}
                >
                    <p class="ml-2"> {planner.name} </p>

                    <input 
                        type="checkbox" 
                        id={planner.id} 
                        checked={planner.users[authStore.getUserId()]} 
                        class="m-2 size-4 accent-text-300"
                    >   
                </button>
            {/each}
        </div>
    </section>

    <section class="flex-4 border border-background-300 rounded-xl p-4">
        <h2 class="font-default font-semibold text-xl text-center pb-4">Task</h2>

        <div class="flex flex-col">
            {#each taskStore.getList() as task}
                <button
                    onclick={() => showTask(task)} 
                    class="flex justify-between items-center h-13 border-b border-dotted border-background-300 hover:bg-background-50 cursor-pointer p-2"
                >
                    <section class="flex items-center gap-x-1 text-left">
                        <input 
                            type="checkbox" 
                            class="m-2 ml-0 size-4 accent-text-300"
                            id={task.id} 
                            checked={task.completed} 
                        >   

                        <div>
                            <h3 class="font-bold"> {task.name} </h3>
                            <p class="text-sm"> Due Date: {task.dueDate.format("dddd D, MMMM YYYY")} </p>
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
            {/each}
        </div>
    </section>

    {#if editModalOpen == true && editedTask != null}
        <section class="flex-1 flex flex-col gap-y-4 border border-background-300 rounded-xl p-4">
            <h2 class="font-default font-semibold text-xl text-center pb-4">Edit Task</h2>

            <div>
                <p class="font-bold">Title</p>
                <input 
                    type="text" 
                    value={editedTask.name}
                    class="border border-background-300 rounded-lg p-1 w-full"
                >
            </div>

            <div>
                <p class="font-bold">Due Date</p>
                <input 
                    type="date" 
                    value={editedTask.dueDate.format("YYYY-MM-DD")}
                    class="border border-background-300 rounded-lg p-1 w-full"
                    min={dayjs().format("YYYY-MM-DD")}
                >
            </div>

            <div>
                <p class="font-bold">Planner</p>

                <PlannerSelect 
                    planners={plannerStore.getList()} 
                    task={editedTask}
                />
            </div>
        </section>
    {/if}
</main>