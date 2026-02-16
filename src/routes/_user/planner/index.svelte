<!-- CODE: -->
<script lang="ts">
    import { authStore } from "@/lib/auth/store.svelte";
    import { plannerStore } from "@/lib/planner/store.svelte";
    import { type NewPlannerData, type Planner } from "@/lib/planner/type";
    import { plannerRepo } from "@/lib/planner/repository";
    import { Plus } from "@lucide/svelte";
    import { type ColorKey, colors } from "@/components/util/color";
    import ColorPicker from "@/components/ui/color-picker.svelte";

    let newPlanner: NewPlannerData = $state({
        name: "",
        users: {},
        color: "red" as ColorKey
    })

    
    // This is a function for adding a new task and resetting the inputs
    function addNewPlanner(): void {
        newPlanner.users = {
            [authStore.getUserId()]:  false
        }

        plannerRepo.createPlanner(newPlanner)
        
        newPlanner = {
            name: "",
            users: {},
            color: "red" as ColorKey
        }
    }
</script>


<!-- COMPONENT: This is planner tile snippet that is used to show a single planner -->
{#snippet plannerTile(planner: Planner)}
    <div
        class="flex justify-between items-center h-13 border-b border-dotted border-background-300 hover:bg-background-50 cursor-pointer p-2"
    >
        <section class="flex items-center gap-x-1 text-left">
            <input 
                type="checkbox" 
                class="m-2 ml-0 size-4 accent-content-900"
                checked={planner.visible}
                onclick={() => plannerRepo.setVisibility(authStore.getUserId(), planner.id, !planner.visible)}
            >   

            <div>
                <h3 class="font-bold"> {planner.name} </h3>
                <p class="truncate max-w-150">
                    Users: 
                    {#each Object.entries(planner.users) as [id]}
                        {id}
                    {/each}
                </p>
            </div>
        </section>

        <div class="flex gap-x-2">
            <span class="flex items-center">
                <div class="text-sm font-light bg-{colors[planner.color]} h-4 w-16"> </div>
            </span>
        </div>
    </div>
{/snippet}

<!-- COMPONENT: This is the snippet used to show a list of planners -->
{#snippet listOfPlanners(list: Planner[])}
    <main class="flex flex-col">
        {#each list as planner}
            {@render plannerTile(planner)}
        {/each}
    </main>
{/snippet}


<!-- VIEW: This is what is shown on the arrival of the page -->
<main class="flex-1 flex p-4 pt-0 gap-x-4 min-h-0 bg-background-50">
    <section class="flex flex-col gap-y-4 flex-4 border border-background-300 rounded-xl p-4">
        <h2 class="font-default font-semibold text-xl text-center">Planner</h2>

        <!-- This area renders a list of planners -->
        <div class="flex-1 flex flex-col min-h-0 gap-y-4 overflow-y-auto"> 
            {@render listOfPlanners(plannerStore.getList())}
        </div>

        <!-- This area is the place to add planners -->
        <form
            class="flex border border-background-300 focus-within:outline focus-within:outline-background-500 rounded-lg p-1.5"
            onsubmit={(e) => { 
                e.preventDefault(); 
                addNewPlanner();
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
                    placeholder="Enter a new planner.."
                    aria-required="true"
                    required
                    bind:value={newPlanner.name}
                >
            </div>

            <ColorPicker bind:value={newPlanner.color}/>
        </form>
    </section>
</main>