<script lang="ts">
    import { type Planner } from "@/lib/planner/type";
    import ColorPicker from "../inputs/color-picker.svelte";
    import { Trash, X } from "@lucide/svelte";

    let { planner }: { planner: Planner | null } = $props()
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

            <div>
                <p class="font-bold">Title</p>
                <input 
                    type="text" 
                    class="border border-background-300 rounded-lg p-1 w-full"
                    value={planner.name}
                >
            </div>

            <div>
                <p class="font-bold">Color</p>
                <ColorPicker bind:value={planner.color}/>
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