import { db } from "@/lib/config/firebase.ts"
import { collection, query, orderBy, onSnapshot, QuerySnapshot, doc, Unsubscribe, updateDoc, addDoc } from "firebase/firestore";
import { createPlannerConverter, NewPlannerData, Planner } from "./type";

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

    // This changes a users' planner visible status through the "user" field.
    public async setVisibility(uid: string, plannerId: string, newValue: boolean): Promise<void> {
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

    // This adds a new planner into the planners database
    public async createPlanner(newPlanner: NewPlannerData): Promise<void> {
        // A guard clause to prevent a new task being added if there is no name
        // or planners attached to the task.
        if (newPlanner.name.trim() == "") {
            return 
        }

        // Grabs the planner collection from Firestore and adds a new document using the converter. 
        const newPlannerRef = collection(db, "planners").withConverter(createPlannerConverter())
                
        console.log(newPlanner.users)
        await addDoc(newPlannerRef, {
            name: newPlanner.name,
            users: newPlanner.users,
            color: newPlanner.color            
        });
    }
}

export const plannerRepo = new PlannerRepository()