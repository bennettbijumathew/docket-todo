<!-- CODE -->
<script lang="ts">
    import { type Task } from "@/lib/task/type";
    import TaskEditor from "@/components/ui/task/editor/task-editor.svelte";
    import TaskSidebar from "@/components/ui/task/sidebar/task-sidebar.svelte";
    import TaskListByCompleted from "@/components/ui/task/list/task-list-by-completed.svelte";

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

<main class="
    flex flex-col flex-1 inset inset-shadow-b-md
    sm:min-h-0 sm:flex-row *:sm:inset-shadow-l-md
">
    <!-- This shows a sidebar with a navigation bar and a planner list that can be toggled. -->
    <TaskSidebar/>

    <TaskListByCompleted 
        onTaskSelect={toggleEditModal}
    />

    <TaskEditor     
        taskId={selectedTask?.id ?? null} 
        toggleFn={() => toggleEditModal(null)}
    />
</main>