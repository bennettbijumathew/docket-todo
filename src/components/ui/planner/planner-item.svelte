<script lang="ts">
    import Checkbox from "@/components/ui/inputs/checkbox.svelte";
    import { colors } from "@/components/util/color";
    import { editPlannerVisibility } from "@/lib/planner/service";
    import { type Planner } from "@/lib/planner/type";
    import { PaintBucket } from "@lucide/svelte";
    import { plannerMenu } from "./planner-menu.svelte";
    import MenuTrigger from "@/components/ui/layout/menu/trigger.svelte";
    import { editor } from "@/components/ui/layout/editor/util.svelte";
    import MenuRoot from "@/components/ui/layout/menu/root.svelte";

    /** The item receives the planner's details and a optional function that can be used by the caller.  */
    interface ItemProps {
        planner: Planner
    }   

    let { planner }: ItemProps = $props() 
</script>

<MenuRoot items={plannerMenu.items}>
    <MenuTrigger
        onLeftClick={(e) => {
            if (e.ctrlKey) {
                plannerMenu.select(planner)
            }
            else {
                editor.value == planner.id ? editor.close() : editor.open(planner.id)
            }
        }}
        onRightClick={() => plannerMenu.open(planner)}
        ariaLabel="Button to view details about '{planner.name}'"
        triggerClasses="
            {plannerMenu.selectedPlanners.has(planner) ? 'border border-background-400' : 'border border-background-100'}
            flex items-center shrink-0 py-0.5 rounded-md cursor-pointer bg-background-50 hover:bg-background-100
            min-h-24 px-2 gap-2
            sm:min-h-22 sm:px-3 sm:gap-3
            lg:min-h-16
        "
    >
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
    </MenuTrigger>
</MenuRoot>