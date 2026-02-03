import { db } from "@/lib/config/firebase.ts"
import { collection, query, orderBy, onSnapshot, QuerySnapshot, where, getDocs } from "firebase/firestore";
import { Planner } from "./type";

export class PlannerRepository {
    onChange(userId: string, callbackFn: (planner: Planner[]) => void) {
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

    async getVisiblePlanners(userId: string): Promise<string[]> {
        const q = query(collection(db, "planners"), where(`users.${userId}`, "==", true));
        const document = await getDocs(q)

        return document.docs.map((doc) => 
            doc.id,
        )
    }   
}

export const plannerRepo = new PlannerRepository()