import { db } from "@/lib/config/firebase.ts"
import { collection, query, orderBy, onSnapshot, QuerySnapshot, doc, Unsubscribe, updateDoc } from "firebase/firestore";
import { Planner } from "./type";
import { ColorKey } from "../../components/util/color";

export class PlannerRepository {
    // This returns a listeners that returns the list of planners that are related to the user.
    public onChange(userId: string, callbackFn: (planner: Planner[]) => void): Unsubscribe {
        const q = query(collection(db, "planners"), orderBy("name"), orderBy(`users.${userId}`));
        
        // This snapshot sets the planner list while adding a visible attribute for each user 
        return onSnapshot(q, (querySnapshot: QuerySnapshot) => {
            const planners = querySnapshot.docs.map((doc) => { 
                return { 
                    id: doc.id,
                    name: doc.data().name,
                    users: doc.data().users,
                    visible: doc.data().users[userId],
                    color: doc.data().color as ColorKey,
                }
            })

            callbackFn(planners)
        })            
    }

    // This changes a users' planner visible status through the "user" field.
    public async toggleVisibility(uid: string, plannerId: string, newValue: boolean): Promise<void> {
        const plannerRef = doc(db, "planners", plannerId)
        
        await updateDoc(plannerRef, {
            [`users.${uid}`]: newValue
        })
    }
}

export const plannerRepo = new PlannerRepository()