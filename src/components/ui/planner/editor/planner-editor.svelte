<script lang="ts">
    import { type Planner } from "@/lib/planner/type";
    import ColorPicker from "../../inputs/color-picker.svelte";
    import { Trash } from "@lucide/svelte";
    import { type ColorKey } from "@/components/util/color";
    import { editPlannerColor, editPlannerName, removePlanner } from "@/lib/planner/service";

    // The component receives the selected planner id with a function that 
    // handles the behavior of the open and close state of the editor. 
    interface EditorProps {
        planner: Planner | null, 
        onClose?: () => void
    }
    
    let { 
        planner: initialPlanner, 
        onClose 
    }: EditorProps = $props()


    // Gets the planner that is derived from the state array.
    const planner: Planner | null = $derived(initialPlanner);

    // Inputs of this editor are initialized with effect used to ensure that inputs are synced with the state variables.
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
</script>

<!-- VIEW: A list of inputs that change a planner's details -->
{#if planner != null}
    <div class="flex flex-col flex-1 gap-y-4">
        <!-- Form to update name changes for the planner -->
        <form 
            onsubmit={(e) => {
                e.preventDefault(); 
                if (planner.name != inputs.name) {
                    editPlannerName({
                        id: planner.id,
                        name: inputs.name
                    })
                }
            }}
        >
            <p class="font-bold">Title</p>
            <input 
                type="text" 
                class="bg-background-50 hover:bg-background-100 focus:bg-background-200 outline-none rounded-lg p-1 px-1.5 w-full shadow-md"
                bind:value={inputs.name}
                onblur={() => {
                    if (planner.name != inputs.name) {
                        editPlannerName({
                            id: planner.id,
                            name: inputs.name
                        })
                    }
                }}
            >
        </form>

        <div class="flex flex-col">
            <p class="font-bold">Color</p>

            <ColorPicker 
                value={inputs.color} 
                buttonClass="rounded-lg px-2 py-1"
                offset={5}
                onChangeFn={(newColor) => { 
                    inputs.color = newColor as ColorKey

                    editPlannerColor({
                        id: planner.id,
                        color: inputs.color
                    })
                }}
            />
        </div>

    </div>
    
    <div class="text-center">
        <button 
            class="p-2 border border-background-300 hover:bg-background-100 rounded-lg cursor-pointer"
            onclick={() => {
                removePlanner({
                    id: planner.id
                })

                onClose?.()
            }}
        >   
            <Trash class="size-4"/>
        </button>
    </div>
{:else}
    <div class="flex flex-col flex-1 justify-center items-center">
        <h2 class="font-title font-semibold text-md"> Error Found </h2>
        <p> Can't edit the selected item.</p>
    </div>
{/if}