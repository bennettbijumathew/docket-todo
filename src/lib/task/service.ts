import { toast } from "svelte-sonner"
import { NewTaskData } from "./type"
import { deleteTask, MIN_PLANNERS, writeNewTask } from "./repository"

// This creates a new task and updates the user interface on errors
export function createTask(newTask: NewTaskData): void {
    if (newTask.name.trim() == "") {
        toast.error("To create a new task, the title requires a non-empty field")
        return 
    }
    else if (newTask.planners.size <= MIN_PLANNERS) {
        toast.error("To create a new task, the task requires more than 0 planners")
        return 
    }
            
    writeNewTask({
        name: newTask.name,
        planners: newTask.planners,
        dueDate: newTask.dueDate            
    });
}

// This removes a task while updating the interface on errors
type removeArgs = {
    id: string
}

export function removeTask({id}: removeArgs): void {
    if (id.trim() == "") {
        toast.error("The task could not be deleted");
        return;
    }

    deleteTask({
        id: id
    });
}