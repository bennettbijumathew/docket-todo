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
            [authentication.userId]: true
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
    <div class="
        flex flex-row flex-1 bg-background-100 p-1 rounded-lg gap-1
        flex-wrap
        lg:flex-nowrap
    ">
        <input 
            type="text" 
            class="min-h-8 flex-1 px-2 hover:bg-background-200 outline-background-400 rounded-lg"
            placeholder="Enter a new planner.."
            aria-required="true"
            required
            bind:value={newPlanner.name}
        >

        <div class="
            flex gap-2 justify-end overflow-x-visible
            flex-1
            sm:flex-none
        ">
            <ColorPicker 
                value={newPlanner.color}
                onChangeFn={(newColor) => newPlanner.color = newColor as ColorKey}
                triggerClass="
                    border border-background-300 hover:border-background-400 outline-background-400 rounded-lg p-1 
                    w-full
                    sm:w-40
                "
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
