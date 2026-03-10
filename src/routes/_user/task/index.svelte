<!-- CODE -->
<script lang="ts">
    import { type Task } from "@/lib/task/type";
    import TaskSidebar from "@/components/ui/task/sidebar/task-sidebar.svelte";
    import TaskEditor from "@/components/ui/task/editor/task-editor.svelte";
    import TaskListByCompleted from "@/components/ui/task/list/task-list-by-completed.svelte";
    import Main from "@/components/ui/layout/main.svelte";
    import Sidebar from "@/components/ui/layout/sidebar.svelte";
    import Editor from "@/components/ui/layout/editor.svelte";

    // These variables represent the current planner that is open on the modal
    let selectedTask: Task | null = $state(null)

    // This function toggles the task editing modal.
    function toggleEditModal(task: Task | null) {
        // If the user clicks on the same task or the task doesn't exist
        // Then the modal is hidden from the users' view 
        if (selectedTask === task || task === null) {
            selectedTask = null
            return; 
        }

        // If the guard clauses are passed, then the new task is set with the view being open.
        selectedTask = task
    }
</script>

<!-- VIEW -->
<!-- This shows a sidebar with a navigation bar and a planner list that can be toggled. -->
<Sidebar>
    <TaskSidebar/>
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

    <!-- On selecting the task, the <Editor> opens -->
    <TaskListByCompleted 
        onTaskSelect={toggleEditModal}
    />
</Main> 

<!-- This shows an editor that is opened when a user clicks on a task. -->
<Editor 
    header="Edit Task" 
    onClose={() => toggleEditModal(null)}
    openState={selectedTask == null ? false : true}
>
    <TaskEditor     
        taskId={selectedTask?.id ?? null} 
        onClose={() => toggleEditModal(null)}
    />
</Editor>
