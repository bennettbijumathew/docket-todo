<script lang="ts">
    import { type Snippet } from "svelte";
    import { ChevronDown, ChevronRight } from "@lucide/svelte";

    // This receives a list of tasks and a header as props from the caller.
    interface GroupProps {
        children: Snippet, 
        header: string
    }

    let { 
        children: taskList, 
        header 
    }: GroupProps = $props() 
    

    // This is a state variable to hide and reveal the group of tasks.
    let isGroupShown = $state(true)

    // Function to toggle the state of the task being shown.
    function toggleGroupShown(): void {
        isGroupShown = !isGroupShown
    }
</script>

<div>
    <!-- This toggles the list of tasks from the users' view -->
    <button 
        onclick={toggleGroupShown}
        class="flex items-center mb-2 gap-x-2 cursor-pointer hover:border-background-200 border-b border-background-50 transition-colors"
        aria-label="Button to toggle '{header}'" 
    >
        <h3 class="font-title text-md"> {header} </h3>

        {#if isGroupShown == true}
            <ChevronDown class="size-4"/>
        {:else}
            <ChevronRight class="size-4"/>
        {/if}
    </button>

    <!-- Shows a list of complete tasks -->
    {#if isGroupShown === true}  
        <main class="flex flex-col gap-y-2">
            {@render taskList()}
        </main>
    {/if}
</div>
