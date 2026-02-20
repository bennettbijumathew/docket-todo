import { db } from "@/lib/config/firebase.ts"
import { collection, query, orderBy, onSnapshot, QuerySnapshot, doc, Unsubscribe, updateDoc, addDoc, deleteDoc } from "firebase/firestore";
import { createPlannerConverter, NewPlannerData, Planner } from "./type";
import { ColorKey } from "@/components/util/color";
import { taskRepo } from "../task/repository";

export class PlannerRepository {
    // This returns a listeners that returns the list of planners that are related to the user.
    public onChange(userId: string, callbackFn: (planner: Planner[]) => void): Unsubscribe {
        // Gets a list of planners ordered by name and the current user of the planner. 
        // Applies a converter to help transition from Firestore to code.
        const q = query(collection(db, "planners"), orderBy("name"), orderBy(`users.${userId}`)).withConverter(createPlannerConverter(userId));
        
        // This snapshot sets the planner list while adding a visible attribute for each user 
        return onSnapshot(q, (querySnapshot: QuerySnapshot) => {
            const newPlanners: Planner[] = querySnapshot.docs.map((doc) => doc.data()) as Planner[]

            callbackFn(newPlanners)
        })            
    }


    // This adds a new planner into the planners database
    public async createPlanner(newPlanner: NewPlannerData): Promise<void> {
        // A guard clause to prevent a new task being added if there is no name
        // or planners attached to the task.
        if (newPlanner.name.trim() == "") {
            return 
        }
        
        // Grabs the planner collection from Firestore and adds a new document using the converter. 
        const newPlannerRef = collection(db, "planners").withConverter(createPlannerConverter())
        
        await addDoc(newPlannerRef, {
            name: newPlanner.name,
            users: newPlanner.users,
            color: newPlanner.color            
        });
    }

    // This removes a planner from the planners database
    public async deletePlanner(plannerId: string): Promise<void> {
        // A guard clause to stop the function when there is no planner id.
        if (plannerId.trim() == "") {
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
        if (plannerId.trim() == "" || newName.trim() == "") {
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
            return
        }

        // This updates the planner to have a new color.
        const plannerRef = doc(db, "planners", plannerId)

        await updateDoc(plannerRef, {
            color: newColor
        })
    }

    // This changes a users' planner visible status through the "user" field.
    public async editUserVisibility(uid: string, plannerId: string, newValue: boolean): Promise<void> {
        // A guard clause to stop the function when there is no user id or planner id.
        if (uid.trim() == "" || plannerId.trim() == "") {
            return
        }

        // This toggles the planner to have a new visibility for the user.
        const plannerRef = doc(db, "planners", plannerId)
        
        await updateDoc(plannerRef, {
            [`users.${uid}`]: newValue
        })
    }
}
    
    export const plannerRepo = new PlannerRepository()