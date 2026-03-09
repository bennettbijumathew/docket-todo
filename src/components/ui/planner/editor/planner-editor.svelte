<script lang="ts">
    import { type Planner } from "@/lib/planner/type";
    import ColorPicker from "../../inputs/color-picker.svelte";
    import { Trash, X } from "@lucide/svelte";
    import { plannerRepo } from "@/lib/planner/repository";
    import { type ColorKey } from "@/components/util/color";
    import { plannerStore } from "@/lib/planner/store.svelte";


    // The component receives the selected planner id with a function that 
    // handles the behavior of the open and close state of the editor. 
    interface EditorProps {
        plannerId: string | null, 
        toggleFn: () => void
    }
    
    let { plannerId, toggleFn }: EditorProps = $props()


    // Gets the planner from the planner id. Through this method, changes in the state is updated properly
    const planner: Planner | null = $derived(plannerStore.getList().find(p => p.id === plannerId) || null);


    // Inputs of this editor are initialized with effect used to 
    // ensure that inputs are synced with the state variables.
    let inputs = $state({
        name: "", 
        color: "red" as ColorKey
    })

    $effect(() => {
        if (planner) {
            inputs.name = planner.name
            inputs.color = planner.color
        }
    })


    // Functions to update the planners' name
    function submitNameChange() {
        // Doesn't edit the name if planner doesn't exist or if input and planner names are the same
        if (planner === null || planner.name === inputs.name || inputs.name.trim() === "" ) {
            return 
        }

        plannerRepo.editName(planner.id, inputs.name) 
    }

    // Functions to update the planners' name
    function submitColorChange() {
        // // Doesn't edit the color if planner doesn't exist
        if (planner === null) {
            return 
        }

        plannerRepo.editColor(planner.id, inputs.color) 
    }

    // Functions to delete the planner
    function submitDeletionOfPlanner(plannerId: string | null) {
        // // Doesn't delete the planner if planner doesn't exist
        if (planner === null || plannerId == null) {
            return 
        }

        plannerRepo.deletePlanner(plannerId) 
    }
</script>

<!-- VIEW: A list of inputs that change a planner's details -->
{#if planner != null}
    <section class="flex flex-col justify-between flex-1 border border-background-300 rounded-xl p-4">
        <div class="flex flex-col gap-y-4">
            <div class="flex justify-between items-center pb-1">
                <h2 class="font-default font-semibold text-xl text-center">Edit Planner</h2>

                <button 
                    class="p-2 border border-background-300 hover:bg-background-100 rounded-lg cursor-pointer"
                    onclick={toggleFn}
                >   
                    <X class="size-4"/>
                </button>
            </div>

            <!-- Form to update name changes for the planner -->
            <form 
                onsubmit={(e) => { 
                    e.preventDefault(); 
                    submitNameChange();
                }}
            >
                <p class="font-bold">Title</p>
                <input 
                    type="text" 
                    class="border border-background-300 rounded-lg p-1 w-full"
                    bind:value={inputs.name}
                    onblur={submitNameChange}
                >
            </form>

            <div class="flex flex-col">
                <p class="font-bold">Color</p>

                <ColorPicker 
                    value={inputs.color} 
                    onChangeFn={(newColor) => { 
                        inputs.color = newColor as ColorKey
                        submitColorChange()
                    }}
                    buttonClass="rounded-lg px-2 py-1"
                    offset={5}
                />
            </div>

        </div>
        
        <div class="text-center">
            <button 
                class="p-2 border border-background-300 hover:bg-background-100 rounded-lg cursor-pointer"
                onclick={() => submitDeletionOfPlanner(planner?.id ?? null)}
            >   
                <Trash class="size-4"/>
            </button>
        </div>
    </section>
{/if}