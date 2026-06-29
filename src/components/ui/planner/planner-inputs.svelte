<script lang="ts">
    import ColorPicker from "@/components/ui/inputs/color-picker.svelte";
    import { type ColorKey } from "@/components/util/color";
    import { authentication } from "@/lib/auth/store.svelte";
    import { createPlanner } from "@/lib/planner/service";
    import { type NewPlannerData } from "@/lib/planner/type";
    import { Plus } from "@lucide/svelte";

    // This variable represents the input data used to create a new planner
    let newPlanner: NewPlannerData = $state({
        name: "",
        users: {},
        color: "red" as ColorKey
    })
   
    // This is a function for adding a new planner and resetting the inputs
    function addNewPlanner(): void {
        newPlanner.users = {
            [authentication.userId]:  false
        }

        createPlanner(newPlanner)
        
        newPlanner = {
            name: "",
            users: {},
            color: "red" as ColorKey
        }
    }
</script>
        
<!-- This area is the place to add planners -->
<form
    class="flex shrink-0 border-t border-background-300 p-4 gap-x-2"
    onsubmit={(e) => { 
        e.preventDefault(); 
        addNewPlanner();
    }}
>
    <!-- Section to write name for the new planner -->
    <div class="
        flex flex-row flex-1 bg-background-100 p-1 rounded-lg gap-2
        flex-wrap
        lg:flex-nowrap
    ">
        <input 
            type="text" 
            class="min-h-8 flex-auto px-2 hover:bg-background-200 rounded-lg grow"
            placeholder="Enter a new planner.."
            aria-required="true"
            required
            bind:value={newPlanner.name}
        >

        <div class="flex-1 flex gap-2 justify-end overflow-x-visible">
            <ColorPicker 
                value={newPlanner.color}
                onChangeFn={(newColor) => newPlanner.color = newColor as ColorKey}
            />
        </div>
    </div>

    <button 
        class="
            flex items-center justify-center bg-background-100 hover:bg-background-200 rounded-lg 
            w-14
            sm:w-12
            lg:w-10
        "
        aria-label="Add New Task" 
        type="submit"
    >
        <Plus class="size-4"/>
    </button>
</form>
