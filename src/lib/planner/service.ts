// Purpose:
// The planner service functions are used by the user interface. These functions usually interact 
// with the repository function while handling validation, toasts and errors.

import { ColorKey } from "@/components/util/color";
import { deletePlanner, updatePlannerColor, updatePlannerName, updatePlannerVisibility, writeNewPlanner } from "@/lib/planner/repository";
import { toast } from "svelte-sonner";
import { authentication } from "@/lib/auth/store.svelte";
import { NewPlannerData } from "@/lib/planner/type";

// This function deletes the planner by using the repository.
export function createPlanner(newPlanner: NewPlannerData): void {
    if (newPlanner.name.trim() == "") {
        toast.error("To create a new task, the title requires a non-empty field")
        return 
    }

    writeNewPlanner({
        name: newPlanner.name,
        users: newPlanner.users,
        color: newPlanner.color
    });
}


// This function deletes the planner by using the repository.
type deleteArgs = {
    id: string
}

export function removePlanner({id}: deleteArgs): void {
    if (id.trim() === "") {
        toast.error("Could not delete the planner");
        return;
    }

    deletePlanner({
        id: id
    });
    
    toast.success("Task has been deleted");
}


// This functions edit the planner name.
type editNameArgs = {
    id: string
    name: string
}

export function editPlannerName({id, name}: editNameArgs): void {
    if (id.trim() === "") {
        toast.error("Can't edit the planner name");
        return;
    }

    if (name.trim() === "") {
        toast.error("You need to add an non-empty value for planner name");
        return;
    }

    updatePlannerName({
        id: id,
        name: name
    });
}


// This functions edit the planner color
type editColorArgs = {
    id: string
    color: ColorKey
}

export function editPlannerColor({id, color}: editColorArgs): void {
    if (id.trim() === "") {
        toast.error("Can't edit the planner name");
        return;
    }

    updatePlannerColor({
        id: id,
        color: color
    });
}


// This function edits the user's visibility status of the planner. 
type editVisibleArgs = {
    id: string
    visibility: boolean
}

export function editPlannerVisibility({id, visibility}: editVisibleArgs): void {
    if (id.trim() === "") {
        toast.error("Can't edit the visibility of the planner");
        return;
    }

    updatePlannerVisibility({
        id: id, 
        userId: authentication.userId, 
        visibility: visibility
    })
}