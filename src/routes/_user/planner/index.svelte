<script>
    import { auth } from "@/lib/config/firebase";
    import { planners } from "@/stores/planner/index.svelte";
</script>

<main class="flex-1 p-4">
    <h1 class="font-bold text-lg pb-4">planner</h1>

    <section class="flex flex-col gap-y-4">
        {#each planners.list as planner}
            <div class="flex justify-between border p-2">
                <div>
                    <p> {planner.name} </p>
                    <p class="text-sm font-light"> {Object.keys(planner.users)} </p>
                </div>

                <input type="checkbox" defaultchecked={planner.visible}>
            </div>
        {/each}
    </section>
</main>
