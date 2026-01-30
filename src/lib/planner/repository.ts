import { db } from "@/lib/config/firebase.ts"
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { Planner } from "./type";

export class PlannerRepository {
    // This is a function that fetches all of the planners related to a user. 
    async getAllPlanners(userId: string | null): Promise<Planner[]> {
        // If user's ID cannot be found, an empty array will be returned. 
        if (userId === null) {
            return []
        }

        // This queries the Firebase and ensures that it orders by items that only has the users in it
        const plannerQuery = query(collection(db, "planners"), orderBy(`users.${userId}`));
        const querySnapshot = await getDocs(plannerQuery)

        // Maps the result of the query into an array. 
        let planners: Planner[] = querySnapshot.docs.map((doc) => { 
            return { 
                id: doc.id,
                name: doc.data().name,
                users: doc.data().users,
            }
        })
        
        return planners
    }
}

export const plannerRepo = new PlannerRepository()