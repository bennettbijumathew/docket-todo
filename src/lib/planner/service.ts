import { ColorKey } from "@/components/util/color";
import { deletePlanner, updatePlannerColor, updatePlannerName, updatePlannerVisibility } from "@/lib/planner/repository";
import { toast } from "svelte-sonner";
import { authStore } from "../auth/store.svelte";

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


// This functions edit the planner name by using the repository.
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


// This functions edit the planner color by using the repository.
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
        userId: authStore.getUserId(), 
        visibility: visibility
    })
}