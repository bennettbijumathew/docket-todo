import { db } from "@/lib/config/firebase.ts"
import { collection, query, orderBy, onSnapshot, QuerySnapshot, where, getDocs, doc, Unsubscribe, updateDoc } from "firebase/firestore";
import { Planner } from "./type";

export class PlannerRepository {
    // This returns a listeners that returns the list of planners that are related to the user.
    public onChange(userId: string, callbackFn: (planner: Planner[]) => void): Unsubscribe {
        const q = query(collection(db, "planners"), orderBy(`users.${userId}`));
        
        // This snapshot sets the planner list while adding a visible attribute for each user 
        return onSnapshot(q, (querySnapshot: QuerySnapshot) => {
            const planners = querySnapshot.docs.map((doc) => { 
                return { 
                    id: doc.id,
                    name: doc.data().name,
                    users: doc.data().users,
                }
            })

            callbackFn(planners)
        })            
    }

    public async editVisibility(uid: string, id: string, newValue: boolean): Promise<void> {
        const plannerRef = doc(db, "planners", id)
        
        await updateDoc(plannerRef, {
            [`users.${uid}`]: newValue
        })
    }
}

export const plannerRepo = new PlannerRepository()