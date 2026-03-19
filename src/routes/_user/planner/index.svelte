<!-- CODE -->
<script lang="ts">
    import { type Planner } from "@/lib/planner/type";
    import PlannerEditor from "@/components/ui/planner/editor/planner-editor.svelte";
    import Sidebar from "@/components/ui/layout/_user/sidebar.svelte";
    import Main from "@/components/ui/layout/_user/main.svelte";
    import PlannerContainer from "@/components/ui/planner/list/parts/planner-container.svelte";
    import PlannerListByVisible from "@/components/ui/planner/list/planner-list-by-visible.svelte";
    import PlannerInputs from "@/components/ui/planner/list/parts/planner-inputs.svelte";
    import Editor from "@/components/ui/layout/_user/editor.svelte";
    import { searchParams } from "sv-router";
    import { paramKeys, paramValues } from "@/components/util/routes";

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

<Sidebar/>

<Main>
    <h2 class="
        font-title font-semibold text-lg
        text-center
        sm:text-left
    "> 
        Planner List 
    </h2>

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