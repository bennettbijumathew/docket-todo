<!-- CODE -->
<script lang="ts">
    import { authStore } from "@/lib/auth/store.svelte";
    import { plannerStore } from "@/lib/planner/store.svelte";
    import { type NewPlannerData, type Planner } from "@/lib/planner/type";
    import { plannerRepo } from "@/lib/planner/repository";
    import { Plus } from "@lucide/svelte";
    import { type ColorKey } from "@/components/util/color";
    import ColorPicker from "@/components/ui/inputs/color-picker.svelte";
    import PlannerEditor from "@/components/ui/planner/editor/planner-editor.svelte";
    import Sidebar from "@/components/ui/layout/sidebar.svelte";
    import PlannerItem from "@/components/ui/planner/list/parts/planner-item.svelte";
    import Main from "@/components/ui/layout/main.svelte";
    import PlannerContainer from "@/components/ui/planner/list/parts/planner-container.svelte";
    import PlannerListByVisible from "@/components/ui/planner/list/planner-list-by-visible.svelte";
    import PlannerInputs from "@/components/ui/planner/list/parts/planner-inputs.svelte";


    // This variable represents the input data used to create a new planner
    let newPlanner: NewPlannerData = $state({
        name: "",
        users: {},
        color: "red" as ColorKey
    })
   
    // This is a function for adding a new planner and resetting the inputs
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


    // These variables represent the current planner that is open on the modal
    // and the state of the edit modal being open
    let selectedPlanner: Planner | null = $state(null)
    let isEditModalOpen: boolean = $state(false)

    // This function open and closes the edit modal.
    function toggleEditModal(newPlanner: Planner | null) {
        // If the user clicks on the same planner or the planner doesn't exist
        // Then the modal is hidden from the users' view 
        if (newPlanner === selectedPlanner) {
            isEditModalOpen = false
            selectedPlanner = null
            return; 
        }

        // If the guard clauses are passed, then the new planner is set with the view being open.
        selectedPlanner = newPlanner
        isEditModalOpen = true
    }
</script>

<!-- COMPONENT: This is the snippet used to show a list of planners -->
{#snippet listOfPlanners(list: Planner[])}
    <main class="flex flex-col divide-y divide-background-100">
        {#each list as planner}
            <PlannerItem planner={planner}></PlannerItem>
        {/each}
    </main>
{/snippet}


<Sidebar/>

<Main>
    <h2 class="
        font-title font-semibold text-lg
        text-center
        sm:text-left
    "> 
        Planner List 
    </h2>

    <PlannerContainer>
        <PlannerListByVisible/>
    </PlannerContainer>
    
    <PlannerInputs/>
</Main>

<!-- VIEW: This is what is shown on the arrival of the page -->
<main class="flex-1 flex p-4 pt-0 gap-x-4 min-h-0 bg-background">
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

            <ColorPicker 
                value={newPlanner.color}
                onChangeFn={(newColor) => newPlanner.color = newColor as ColorKey}
            />
        </form>
    </section>

    <PlannerEditor plannerId={selectedPlanner?.id ?? null} toggleFn={() => toggleEditModal(selectedPlanner)}/>
</main>