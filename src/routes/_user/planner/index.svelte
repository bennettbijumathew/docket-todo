<script>
    import { authStore } from "@/lib/auth/store.svelte";
    import { auth } from "@/lib/config/firebase";
    import { plannerTaskController } from "@/lib/planner-task/controller";
    import { plannerStore } from "@/lib/planner/store.svelte";
    import { taskStore } from "@/lib/task/store.svelte";
</script>

<main class="flex-1 p-4">
    <h1 class="font-bold text-lg pb-4">planner</h1>

    <section class="flex flex-col gap-y-4">
        {#each plannerStore.getList() as planner}
            <div class="flex justify-between p-2 border border-dotted">
                <div>
                    <p> {planner.name} </p>
                    <p class="text-sm font-light"> {Object.keys(planner.users)} </p>
                </div>
                
                <input type="checkbox" id={planner.id} bind:checked={planner.visible} onclick={() => plannerTaskController.updatePlannerVisibility(authStore.getUserId(), planner.id, !planner.visible)}> 
            </div>
        {/each}

        {#each taskStore.getList() as task}
            <div class="flex justify-between p-2 border border-dotted">
                <div>
                    <p> {task.name} </p>
                    <p class="text-sm font-light"> {task.id}, {task.planners.toString()} </p>
                </div>
            </div>
        {/each}
    </section>
</main>
