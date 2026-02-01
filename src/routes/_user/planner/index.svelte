<script>
    import { auth } from "@/lib/config/firebase";
    import { plannerStore } from "@/lib/planner/store.svelte";
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
            </div>
        {/each}
    </section>
</main>
