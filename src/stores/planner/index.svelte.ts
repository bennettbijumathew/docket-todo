import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from "@/lib/config/firebase.ts"
import { collection, onSnapshot, query, where } from "firebase/firestore";

class PlannerState {
    planners: any[] = $state([])

    constructor() {
        onAuthStateChanged(auth, (user) => {

            const userId = user?.uid ?? ""
            this.planners = []
                
            const q = query(collection(db, "planners"), where(`users.${userId}`, "==", true));

            onSnapshot(q, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    this.planners.push({
                        name: doc.data().name, 
                    })
                })
            })
        }) 
    }   
}

export const plannerState = new PlannerState();