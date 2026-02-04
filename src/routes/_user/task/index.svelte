<script lang="ts">
    import { authStore } from "@/lib/auth/store.svelte";
    import { taskStore } from "@/lib/task/store.svelte";
    import { plannerStore } from "@/lib/planner/store.svelte";
    import { plannerTaskController } from "@/lib/planner-task/controller";
</script>

<main class="flex-1 flex p-4 pt-0 gap-x-4 min-h-0">
    <section class="flex-1 border border-background-300 rounded-xl p-4 flex flex-col min-h-0">
        <h2 class="font-default font-semibold text-xl text-center pb-4">Planner</h2>

        <div class="flex flex-col flex-1 overflow-y-auto">
            {#each plannerStore.getList() as planner}
                <button 
                    class="flex min-h-10 justify-between items-center border-l-10 border-{planner.color} hover:bg-background-50 transition-colors cursor-pointer"
                    onclick={() => plannerTaskController.updatePlannerVisibility(authStore.getUserId() ?? "", planner.id, !planner.users[authStore.getUserId() ?? ""])}
                >
                    <p class="ml-2"> {planner.name} </p>

                    <input 
                        type="checkbox" 
                        id={planner.id} 
                        bind:checked={planner.users[authStore.getUserId() ?? ""]} 
                        class="m-2 size-4 accent-{planner.color}"
                    >   
                </button>
            {/each}
        </div>
    </section>

    <section class="flex-4 border border-background-300 rounded-xl p-4">
        <h2 class="font-default font-semibold text-xl text-center pb-4">Task</h2>

        <div class="flex flex-col">
            {#each taskStore.getList() as task}
                <div class="flex justify-between items-center h-13 border-b border-dotted border-background-300 hover:bg-background-50 cursor-pointer p-2">
                    <section class="flex items-center gap-x-1">
                        <input 
                            type="checkbox" 
                            class="m-2 ml-0 size-4"
                        >   

                        <div>
                            <h3 class="font-bold"> {task.name} </h3>
                            <p class="text-sm">January 1st February</p>
                        </div>
                    </section>

                    <div class="flex gap-x-2">
                        <span class="flex items-center">
                            {#each plannerStore.getSpecific(task.planners) as taskPlanner}    
                                <div class="text-sm font-light bg-{taskPlanner.color} h-4 w-6"> </div>
                            {/each}
                        </span>
                    </div>
                </div>
            {/each}
        </div>
    </section>
</main>