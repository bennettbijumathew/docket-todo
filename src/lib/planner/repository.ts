import { db } from "@/lib/config/firebase.ts"
import { collection, query, orderBy, getDocs } from "firebase/firestore";

export class PlannerRepository {
    async getAllPlanners(userId: string | null) {
        if (userId === null) {
            return []
        }

        const plannerQuery = query(collection(db, "planners"), orderBy(`users.${userId}`));
        const querySnapshot = await getDocs(plannerQuery)

        let planners = querySnapshot.docs.map((doc) => { 
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