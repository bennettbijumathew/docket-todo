import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from "@/lib/config/firebase.ts"
import { collection, onSnapshot, query, Unsubscribe as FirestoreUnsub, orderBy, doc, updateDoc } from "firebase/firestore";
import { Unsubscribe as AuthUnsub } from "firebase/auth";

class PlannerStore {
    public list: any[] = $state([])
    private userId: string = $state("")

    unsubFromAuth: AuthUnsub | null = null
    unsubFromQuery: FirestoreUnsub | null = null

    constructor() {
        this.unsubFromAuth = onAuthStateChanged(auth, (user) => {
            this.list = []
            this.unsubFromQuery?.()
            this.unsubFromQuery = null
            this.userId = user?.uid ?? ""
            
            if (!user) {
                return;
            }   
            
            // This query gets a list of planners that are correlated to the user
            const q = query(collection(db, "planners"), orderBy(`users.${this.userId}`));

            // This snapshot sets the planner list while adding a visible attribute for each user 
            this.unsubFromQuery = onSnapshot(q, (querySnapshot) => {
                this.list = querySnapshot.docs.map((doc) => { 
                    return { 
                        id: doc.id,
                        name: doc.data().name,
                        users: doc.data().users,
                    }
                })
            })            
        }) 
    }  
    
    isToggled(plannerId: string) {
        return this.list.find((item) => item.id == plannerId).users[this.userId]
    }

    togglePlanner(plannerId: string, status: boolean): void {
        const plannerRef = doc(db, "planners", plannerId);

        updateDoc(plannerRef, {
            [`users.${this.userId}`]: status
        })

        console.log(this.list)
    }
}

export const planners = new PlannerStore();