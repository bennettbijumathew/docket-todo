<script lang="ts">
    import { editPlannerColor, editPlannerName, removePlanner } from "@/lib/planner/service";
    import EditorRoot from "@/components/ui/layout/editor/root.svelte";
    import { editor } from "@/components/ui/layout/editor/util.svelte";
    import { type ColorKey } from "@/components/util/color";
    import ColorPicker from "../inputs/color-picker.svelte";
    import { planners } from "@/lib/planner/store.svelte";
    import { type Planner } from "@/lib/planner/type";
    import { Trash, X } from "@lucide/svelte";
    import { fade } from "svelte/transition";

    /** A local reference for the current planner id */
    let activeId = $state<string | null>(null);

    /** The active planner id is updated based on the */
    $effect(() => {
        if (editor.value !== null) {
            activeId = editor.value;
        } 
        /** When editor closes completely, wait for transitions or clear immediately */
        else {
            activeId = null;
        }
    });

    /** Gets the planner that is derived from the current planner id. */
    const planner: Planner | null = $derived.by(() => {
        if (!activeId) { 
            return null 
        };
        
        return planners.get({ id: activeId });
    });
    
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

<EditorRoot>
    <!-- Header that shows title and close button -->
    <header 
        class="
            flex items-center border-b border-background-300 p-4 pt-0 shrink-0 gap-2
        "
    >   
        <!-- Close button -->
        <button 
            onclick={editor.close}
            aria-label="Hide the Planner editor"
            class="flex items-center justify-center bg-background-100 hover:bg-background-200 rounded-lg cursor-pointer size-8"
        >      
            <X class="size-4"/>
        </button>

        <!-- Title -->
        <h1 class="font-title font-semibold text-lg"> Edit Planner </h1>
    </header>

    <!-- Planner details are shown here. -->
    {#if planner}    
        <div 
            class="flex flex-col flex-1 gap-y-4 p-4"
            transition:fade={{duration: 200}} 
        >
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
                    triggerClass="bg-background-50 hover:bg-background-100 focus:bg-background-200 outline-none rounded-lg p-1 px-1.5 w-full shadow-md"
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

                    editor.close()
                }}
            >   
                <Trash class="size-4"/>
            </button>
        </div>
    {:else if activeId == ""}
        <div class="flex flex-1 justify-center items-center">
            <h2 class="font-title"> Planner could not be found. </h2>
        </div>
    {/if}
</EditorRoot>