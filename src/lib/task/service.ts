import { toast } from "svelte-sonner"
import { NewTaskData } from "./type"
import { deleteTask, MIN_PLANNERS, writeNewTask, appendPlannerToTask, detachPlannerFromTask } from "./repository"

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


// This function adds a new planner to the task's list of associated planners. 
type addPlannerArgs = {
    taskId: string
    newPlannerId: string
}

export async function addPlannerToTask({taskId, newPlannerId}: addPlannerArgs): Promise<void> {
    // A guard clause to stop the function when there is no proper id.
    if (taskId.trim() == "" || newPlannerId.trim() == "") {
        toast.error("The planner could not be added to the task")
        return
    }
    
    appendPlannerToTask({
        taskId: taskId, 
        newPlannerId: newPlannerId
    })
}

// This function remove a planner from the task's list of associated planners. 
type removePlannerArgs = {
    taskId: string
    oldPlannerId: string
}

export async function removePlannerFromTask({taskId, oldPlannerId}: removePlannerArgs) {
    // A guard clause to stop the function when there is no proper id.
    if (taskId.trim() == "" || oldPlannerId.trim() == "") {
        toast.error("The planner could not be removed from the task")
        return
    }

    detachPlannerFromTask({
        taskId: taskId, 
        oldPlannerId: oldPlannerId
    })
}