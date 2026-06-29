<!-- CODE -->
<script lang="ts">
    import PlannerListByVisible from "@/components/ui/planner/list/planner-list-by-visible.svelte";
    import PlannerContainer from "@/components/ui/planner/list/parts/planner-container.svelte";
    import PlannerInputs from "@/components/ui/planner/list/parts/planner-inputs.svelte";
    import PlannerEditor from "@/components/ui/planner/editor/planner-editor.svelte";
    import { sidebar } from "@/components/ui/layout/sidebar/util.svelte";
    import SidebarRoot from '@/components/ui/layout/sidebar/root.svelte';
    import { paramKeys, paramValues } from "@/components/util/routes";
    import Editor from "@/components/ui/layout/_user/editor.svelte";
    import Main from "@/components/ui/layout/_user/main.svelte";
    import { type Planner } from "@/lib/planner/type";
    import { PanelLeft } from "@lucide/svelte";
    import { searchParams } from "sv-router";

    // These variables represent the current planner that is open on the modal
    let selectedPlanner: Planner | null = $state(null)

    // This function opens the planner editor. 
    function openEditor(planner: Planner | null) {
        // If the user has clicked on the same planner, the editor closes
        if (selectedPlanner == planner) {
            closeEditor()
        }
        // If a different planner is selected, the planner is opened
        else if (planner !== null) {
            selectedPlanner = planner
            
            // Replaces the "edit" search parameter with a true value.
            searchParams.delete(paramKeys["editor"])
            searchParams.append(paramKeys["editor"], paramValues["editor"].open)
        }
    }

    // Closes the editor
    function closeEditor() {
        selectedPlanner = null
        
        // Deletes the current "edit" parameter.
        searchParams.delete(paramKeys["editor"])
    }   

</script>

<SidebarRoot/>

<Main>
    <!-- The title and sidebar toggle -->
    <div class="flex items-center gap-x-2">
        <button 
            onclick={() => sidebar.toggle()}
            aria-label="Toggle the sidebar"
            class="flex items-center justify-center bg-background-100 hover:bg-background-200 rounded-lg cursor-pointer size-8"
        >      
            <PanelLeft class="size-4"/>
        </button>

        <h1 class="font-title font-semibold text-lg"> Planner List </h1>
    </div>

    <PlannerContainer>
        <PlannerListByVisible
            onPlannerSelect={openEditor}
        />
    </PlannerContainer>
    
    <PlannerInputs/>
</Main>

<Editor
    header="Edit Planner"
    onClose={closeEditor}
>
    <PlannerEditor 
        planner={selectedPlanner} 
        onClose={closeEditor}
    />
</Editor>