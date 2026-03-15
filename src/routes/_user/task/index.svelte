<!-- CODE -->
<script lang="ts">
    import { type Task } from "@/lib/task/type";
    import TaskListByCompleted from "@/components/ui/task/list/task-list-by-completed.svelte";
    import Main from "@/components/ui/layout/main.svelte";
    import Sidebar from "@/components/ui/layout/sidebar.svelte";
    import { navigate } from 'sv-router/generated';
    import TaskInputs from "@/components/ui/task/list/parts/task-inputs.svelte";
    import TaskContainer from "@/components/ui/task/list/parts/task-container.svelte";
    import PlannerToggleList from "@/components/ui/task/sidebar/planner-toggle-list.svelte";
    import Editor from "@/components/ui/layout/editor.svelte";
    import TaskEditor from "@/components/ui/task/editor/task-editor.svelte";

    // These variables represent the current planner that is open on the modal
    let selectedTask: Task | null = $state(null)

    // This function opens the task editor. 
    function openEditor(task: Task | null) {
        // If the user has clicked on the same task, the editor closes
        if (selectedTask == task) {
            closeEditor()
        }
        // If a different task is selected, the task is opened
        else if (task !== null) {
            selectedTask = task
    
            navigate("/task", {
                hash: "edit"
            })
        }
    }

    // Closes the editor
    function closeEditor() {
        selectedTask = null

        navigate("/task", {
            hash: ""
        })
    }   
</script>

<!-- VIEW -->
<!-- This shows a sidebar with a navigation bar and a planner list that can be toggled. -->
<Sidebar>
    <PlannerToggleList/>
</Sidebar>

<!-- This shows a header and a list of completed and incomplete tasks -->
<Main>
    <h2 class="
        font-title font-semibold text-lg
        text-center
        sm:text-left
    "> 
        Task List 
    </h2>

    <TaskContainer>
        <!-- On selecting the task, the <Editor> opens -->
        <TaskListByCompleted 
            onTaskSelect={openEditor}
        />
    </TaskContainer>  

    <TaskInputs/>
</Main> 

<Editor         
    header="Edit Task"
    onClose={() => closeEditor()}
>
    <TaskEditor 
        task={selectedTask}
        onClose={() => closeEditor()}
    />
</Editor>