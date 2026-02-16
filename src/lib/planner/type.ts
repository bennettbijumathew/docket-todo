import { QueryDocumentSnapshot } from "firebase/firestore";
import { ColorKey } from "../../components/util/color";

// The default type for planners.
export interface Planner { 
    id: string, 
    name: string,
    users: Record<string, boolean>,
    visible: boolean,
    color: ColorKey
}

// A interface used for adding new planners into the database. 
// The missing variables are either handled by firestore or are added by the code. 
export interface NewPlannerData {
    name: string,
    users: Record<string, boolean>
    color: ColorKey
}

// An extended planner type that adds a selected variable for representing if the planner is selected for a task. 
export interface TaskPlanner extends Planner { 
    selected: boolean
}

// A converter used in Firestore calls to convert data into the correct format.
export const createPlannerConverter = (userId?: string) => ({
    // Function used to convert new objects into firestore documents
    toFirestore: (planner: NewPlannerData) => {
        return {
            name: planner.name,
            users: planner.users,
            color: planner.color as string
        };
    },

    // Function used to convert planners from firestore into objects
    fromFirestore: (snapshot: QueryDocumentSnapshot) => {
        const data = snapshot.data();

        const planner: Planner = {
            id: snapshot.id,
            name: data.name,
            users: data.users,
            // User id is used to determine the visible state of the planner
            visible: userId ? data.users[userId] : false,
            color: data.color as ColorKey,
        }

        return planner;
    }
});
