import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from "@/lib/config/firebase.ts"
import { collection, onSnapshot, query, where, Unsubscribe as FirestoreUnsub, orderBy } from "firebase/firestore";
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
                querySnapshot.forEach((doc) => {
                    this.planners.push({
                        name: doc.data().name,
                        users: doc.data().users
                    })

                    console.log(Object.hasOwn(doc.data().users, userId))
                })
            })            
        }) 
    }   
}

export const plannerState = new PlannerState();