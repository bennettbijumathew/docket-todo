import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from "@/lib/config/firebase.ts"
import { collection, onSnapshot, query, Unsubscribe as FirestoreUnsub, orderBy } from "firebase/firestore";
import { Unsubscribe as AuthUnsub } from "firebase/auth";

class PlannerState {
    planners: any[] = $state([])
    unsubFromAuth: AuthUnsub | null = null
    unsubFromQuery: FirestoreUnsub | null = null

    constructor() {
        this.unsubFromAuth = onAuthStateChanged(auth, (user) => {
            const userId = user?.uid ?? ""
            this.planners = []

            this.unsubFromQuery?.()
            this.unsubFromQuery = null
            
            if (!user) return

            // This query gets a list of planners that are correlated to the user
            const q = query(collection(db, "planners"), orderBy(`users.${userId}`));

            this.unsubFromQuery = onSnapshot(q, (querySnapshot) => {
                this.planners = querySnapshot.docs.map((doc) => { 
                    return { 
                        name: doc.data().name,
                        users: doc.data().users
                    }
                })
            })            
        }) 
    }   
}

export const plannerState = new PlannerState();