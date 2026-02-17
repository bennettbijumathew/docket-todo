<script lang="ts">
    import { type Planner } from "@/lib/planner/type";
    import ColorPicker from "../inputs/color-picker.svelte";
    import { Trash, X } from "@lucide/svelte";
    import { plannerRepo } from "@/lib/planner/repository";

    let { planner }: { planner: Planner | null } = $props()

    let inputs = $derived({
        name: planner?.name ?? ""   
    })


    // Functions to update the planners' name
    function submitNameChange() {
        // Doesn't edit the name if planner doesn't exist or if input and planner names are the same
        if (planner === null || planner.name === inputs.name || inputs.name.trim() === "" ) {
            return 
        }

        plannerRepo.editName(planner.id, inputs.name) 
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
                >   
                    <X class="size-4"/>
                </button>
            </div>

            <!-- Form to update name changes for the task -->
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
                    bind:value={planner.color} 
                    position="bottom"
                    onChangeFn={(newColor) => console.log(newColor)}
                    popoverClass="grid grid-cols-4 grid-rows-4 gap-2"
                    buttonClass="rounded-lg px-2 py-1"
                    alignment="start"
                    offset={5}
                />
            </div>

        </div>
        
        <div class="text-center">
            <button 
                class="p-2 border border-background-300 hover:bg-background-100 rounded-lg cursor-pointer"
            >   
                <Trash class="size-4"/>
            </button>
        </div>
    </section>
{/if}