<script lang="ts">
    import { type Planner } from "@/lib/planner/type";
    import ColorPicker from "../inputs/color-picker.svelte";

    let { planner }: { planner: Planner | null } = $props()
</script>

<!-- VIEW: A list of inputs that change a planner's details -->
{#if planner != null}
    <h2 class="font-default font-semibold text-xl text-center pb-4">Edit Planner</h2>

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
{/if}