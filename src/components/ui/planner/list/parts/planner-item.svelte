<script lang="ts">
    import Checkbox from "@/components/ui/inputs/checkbox.svelte";
    import { colors } from "@/components/util/color";
    import { editPlannerVisibility } from "@/lib/planner/service";
    import { type Planner } from "@/lib/planner/type";
    import { PaintBucket } from "@lucide/svelte";

    // The item receives the planner's details and a optional function that can be used by the caller. 
    interface ItemProps {
        planner: Planner
        onPlannerSelect?: (planner: Planner) => void
    }   

    let { planner, onPlannerSelect }: ItemProps = $props() 
</script>

<button
    onclick={() => onPlannerSelect?.(planner)}
    class="
        flex justify-between items-center bg-background-50 hover:bg-background-100 cursor-pointer 
        py-1 px-3 rounded-lg gap-x-1
        sm:py-2 sm:px-3 sm:gap-x-2
    "
    aria-label="Button to open the editor for the planner of '{planner.name}'" 
>
    <div class="flex items-center gap-x-3 text-left">
        <!-- On clicking the checkbox, the planner's visibility is toggled -->
        <Checkbox 
            value={planner.visible}
            stopPropagation={true}
            checkedStyle="size-6 bg-{colors[planner.color]}"
            unCheckedStyle="size-6 border-{colors[planner.color]}"
            onChangeFn={() => { 
                editPlannerVisibility({
                    id: planner.id, 
                    visibility: !planner.visible
                }) 
            }}
        />

        <div>
            <h3 class="font-bold"> {planner.name} </h3>
            
            <span class="flex items-center gap-x-1">
                <PaintBucket class="size-3 hidden sm:block"/>
                
                <p class="text-sm"> Color: {planner.color[0].toUpperCase()}{planner.color.slice(1)} </p>
            </span>
        </div>
    </div>
</button>