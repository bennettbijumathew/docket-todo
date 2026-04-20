import { db } from "@/lib/shared/firebase-config"
import { collection, query, onSnapshot, QuerySnapshot, doc, Unsubscribe, updateDoc, addDoc, deleteDoc, where, CollectionReference, DocumentData, Query, FirestoreDataConverter } from "firebase/firestore";
import { createPlannerConverter, NewPlannerData, Planner } from "./type";
import { ColorKey } from "@/components/util/color";

const plannerDb: string = import.meta.env.VITE_FIRESTORE_PLANNER_DB;

// This returns a listeners that returns the list of planners that are related to the user.
export function listenForPlannerChanges(userId: string, callbackFn: (planner: Planner[]) => void): Unsubscribe {
    const databaseRef: CollectionReference<DocumentData, DocumentData> = collection(db, plannerDb);
    const dataConverter: FirestoreDataConverter<NewPlannerData> = createPlannerConverter(userId);

    // Query - Gets planners where the current user is enrolled into the planners' user field. True or false means that they are enrolled.
    // Converter - Converts data from Firestore to the Planner object.
    const q: Query<NewPlannerData> = query(databaseRef, where(`users.${userId}`, "in", [true, false])).withConverter(dataConverter);

    // This snapshot sets the planner list while adding a visible attribute for each user.
    return onSnapshot(q, (querySnapshot: QuerySnapshot) => {
        let planners: Planner[] = querySnapshot.docs.map((doc) => doc.data()) as Planner[];

        // Mutates the planners to be sorted by name then id. This ensures the same positioning of planners.
        planners.sort((a, b) => {
            const nameCompare = a.name.localeCompare(b.name)
            return nameCompare !== 0 ? nameCompare : a.id.localeCompare(b.id)
        });
        
        // This sends the planner into the callback function. 
        callbackFn(planners);
    })            
}


// This adds a new planner into the planners collection
export async function writeNewPlanner(newPlanner: NewPlannerData): Promise<void> {
    try {
        // Grabs the planner collection from Firestore and adds a new document using the converter. 
        const newPlannerRef = collection(db, plannerDb).withConverter(createPlannerConverter());
        
        await addDoc(newPlannerRef, {
            name: newPlanner.name,
            users: newPlanner.users,
            color: newPlanner.color            
        });
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}


// This deletes a planner from the planners collection using a planner id.
type deleteArgs = {
    plannerId: string
}

export async function deletePlanner({ plannerId }: deleteArgs): Promise<void> {
    try {        
        const plannerRef = doc(db, plannerDb, plannerId);
        
        await deleteDoc(plannerRef);
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}


// This updates the name of planner within the planner collection using an id and new name. 
type updateNameArgs = {
    plannerId: string
    newName: string
}

export async function updatePlannerName({plannerId, newName}: updateNameArgs): Promise<void> {
    try {
        const plannerRef = doc(db, plannerDb, plannerId)
        
        await updateDoc(plannerRef, {
            name: newName
        })
    }
    catch (error) {
        throw error
    }
}


// This updates the color of planner within the planner collection using an id and a color key. 
type updateColorArgs = {
    plannerId: string
    newColor: ColorKey
}

export async function updatePlannerColor({plannerId, newColor}: updateColorArgs): Promise<void> {
    try {
        const plannerRef = doc(db, plannerDb, plannerId)
        
        await updateDoc(plannerRef, {
            color: newColor
        })
    }
    catch (error) {
        throw error
    }
}


// This changes a users' planner visible status through the "user" field.
type updateVisibleArgs = {
    plannerId: string
    uid: string
    newValue: boolean
}

export async function updatePlannerVisibility({uid, plannerId, newValue}: updateVisibleArgs): Promise<void> {
    try {
        // This toggles the planner to have a new visibility for the user.
        const plannerRef = doc(db, plannerDb, plannerId)
        
        await updateDoc(plannerRef, {
            [`users.${uid}`]: newValue
        })
    }
    catch (error) {
        throw error
    }
}