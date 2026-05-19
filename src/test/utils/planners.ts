import { deletePlanner, writeNewPlanner } from "@/lib/planner/repository"
import { createPlannerConverter, NewPlannerData, Planner } from "@/lib/planner/type"
import { db } from "@/lib/shared/firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore"

const reference = collection(db, import.meta.env.VITE_FIRESTORE_PLANNER_DB)


// A list of test planners that have been created. Used to help clean up test planners
let testPlanners: string[] = [];

// A utility function that is called to create a new test planner for the test to use. 
export async function createTestPlanner(userId: string): Promise<Planner> {
    const newPlanner: NewPlannerData = {
        name: `planner-test-${crypto.randomUUID()}`,
        color: "red",
        users: {
            [`${userId}`]: true
        },
    }

    // This creates a new planner using the planner repository functions
    await writeNewPlanner(newPlanner)
    
    const readPlanner = query(reference, where(`users.${userId}`, "in", [true, false])).withConverter(createPlannerConverter(userId));
    
    const newPlannerList = (await getDocs(readPlanner)).docs.map((doc) => doc.data()) as Planner[]
    
    // Finds the created test planner. 
    const createdPlanner = newPlannerList.find(
        (item) => item.name === newPlanner.name
    )
    
    if (createdPlanner === undefined) {
        throw new Error("The created test planner does not exist.")
    }
    
    testPlanners.push(createdPlanner.id)    
    
    // Returns the new planner for the test to use. 
    return createdPlanner
}

// Deletes all test planners that have been created in the test lifecycle.
export async function deleteTestPlanners(): Promise<void> {
    testPlanners.forEach(async (item) => {
        await deletePlanner({
            id: item
        })
    })
}