<script lang="ts">
    import ColorPicker from "@/components/ui/inputs/color-picker.svelte";
    import { type ColorKey } from "@/components/util/color";
    import { authStore } from "@/lib/auth/store.svelte";
    import { plannerRepo } from "@/lib/planner/repository";
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
            [authStore.getUserId()]:  false
        }

        plannerRepo.createPlanner(newPlanner)
        
        newPlanner = {
            name: "",
            users: {},
            color: "red" as ColorKey
        }
    }
</script>
        
<!-- This area is the place to add planners -->
<form
    class="
        block sticky bottom-8 shadow-lg/20 text-content-900 rounded-lg bg-background-50
        sm:flex sm:bottom-0
    "
    onsubmit={(e) => { 
        e.preventDefault(); 
        addNewPlanner();
    }}
>
    <!-- Section to write name for the new planner -->
    <div class="
        flex-1 flex flex-row-reverse sm:flex-row items-center basis-full 
        p-1.5 pb-0
        sm:p-2
    ">
        <button 
            type="submit"
            aria-label="Add a new planner" 
            class="
                bg-background-100 hover:bg-background-200 rounded-lg cursor-pointer
                p-3 
                sm:p-1.5
            " 
        >
            <Plus class="size-4"/>
        </button>

        <input 
            type="text" 
            class="
                outline-none flex-1 pl-1.5 
                py-1.5 
                sm:py-0.5
            "
            placeholder="Enter a new planner.."
            aria-required="true"
            required
            bind:value={newPlanner.name}
        >
    </div>

    <div class="flex overflow-x-scroll sm:overflow-x-visible p-1.5 gap-1.5">
        <ColorPicker 
            value={newPlanner.color}
            onChangeFn={(newColor) => newPlanner.color = newColor as ColorKey}
        />
    </div>
</form>
