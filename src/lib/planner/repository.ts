import { db } from "@/lib/shared/firebase-config"
import { collection, query, onSnapshot, QuerySnapshot, doc, Unsubscribe, updateDoc, addDoc, deleteDoc, where, CollectionReference, DocumentData, Query, FirestoreDataConverter } from "firebase/firestore";
import { createPlannerConverter, NewPlannerData, Planner } from "./type";
import { ColorKey } from "@/components/util/color";
import { taskRepo } from "../task/repository";
import { toast } from "svelte-sonner";

const plannerDbName: string = import.meta.env.VITE_FIRESTORE_PLANNER_DB;

// This returns a listeners that returns the list of planners that are related to the user.
export function listenForPlannerChanges(userId: string, callbackFn: (planner: Planner[]) => void): Unsubscribe {
    const databaseRef: CollectionReference<DocumentData, DocumentData> = collection(db, plannerDbName)
    const dataConverter: FirestoreDataConverter<NewPlannerData> = createPlannerConverter(userId)

    // Query - Gets list of planners from database where the current user is enrolled into the planners' user field.
    // Converter - Converts data from Firestore to the Planner object.
    const q: Query<NewPlannerData> = query(databaseRef, where(`users.${userId}`, "in", [true, false])).withConverter(dataConverter);

    // This snapshot sets the planner list while adding a visible attribute for each user.
    return onSnapshot(q, (querySnapshot: QuerySnapshot) => {
        let planners: Planner[] = querySnapshot.docs.map((doc) => doc.data()) as Planner[]

        // Mutates the planners to be sorted by name then id. This ensures the same positioning of planners.
        planners.sort((a, b) => {
            const nameCompare = a.name.localeCompare(b.name)
            return nameCompare !== 0 ? nameCompare : a.id.localeCompare(b.id)
        })
        
        // This sends the planner into the callback function. 
        callbackFn(planners)
    })            
}

// This adds a new planner into the planners collection
export async function writeNewPlanner(newPlanner: NewPlannerData): Promise<void> {
    try {
        // Grabs the planner collection from Firestore and adds a new document using the converter. 
        const newPlannerRef = collection(db, plannerDbName).withConverter(createPlannerConverter())
        
        await addDoc(newPlannerRef, {
            name: newPlanner.name,
            users: newPlanner.users,
            color: newPlanner.color            
        });
    }
    catch (error) {
        throw error
    }
}

export class PlannerRepository {
    // This removes a planner from the planners database
    public async deletePlanner(plannerId: string): Promise<void> {
        // A guard clause to stop the function when there is no planner id.
        if (plannerId.trim() == "") {
            toast.error("The planner could not be deleted")
            return
        }

        // Since the planners ids are placed in the tasks, the task repo handles the removal of the planner
        // from the task's planners array 
        taskRepo.removePlannerFromAllTasks(plannerId)

        // Using the planner id, the document is deleted of the tasks collection. 
        const plannerRef = doc(db, "planners", plannerId)

        await deleteDoc(plannerRef)
    }

    
    // This changes a planner's title
    public async editName(plannerId: string, newName: string): Promise<void> {
        // A guard clause to stop the function when there is no planner id or new name.
        if (plannerId.trim() == "") {
            toast.error("The planner's name could not be edited")
            return
        }
        else if (newName.trim() == "") {
            toast.error("To edit the planner, the title requires a non-empty field")
            return 
        }

        // This updates the planner to have a new name.
        const plannerRef = doc(db, "planners", plannerId)
        
        await updateDoc(plannerRef, {
            name: newName
        })
    }

    // This changes a planner's title
    public async editColor(plannerId: string, newColor: ColorKey): Promise<void> {
        // A guard clause to stop the function when there is no planner id or new name.
        if (plannerId.trim() == "") {
            toast.error("The planner's color could not be edited")
            return
        }

        // This updates the planner to have a new color.
        const plannerRef = doc(db, "planners", plannerId)

        await updateDoc(plannerRef, {
            color: newColor
        })
    }

    // This changes a users' planner visible status through the "user" field.
    public async editVisibility(uid: string, plannerId: string, newValue: boolean): Promise<void> {
        // A guard clause to stop the function when there is no user id or planner id.
        if (uid.trim() == "" || plannerId.trim() == "") {
            toast.error("The planner's visibility could not be edited")
            return
        }

        // This toggles the planner to have a new visibility for the user.
        const plannerRef = doc(db, "planners", plannerId)
        
        await updateDoc(plannerRef, {
            [`users.${uid}`]: newValue
        })
    }
}
    
export const plannerRepo =  new PlannerRepository()