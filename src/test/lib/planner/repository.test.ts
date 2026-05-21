import { deletePlanner, listenPlanners, updatePlannerColor, updatePlannerName, updatePlannerVisibility } from '@/lib/planner/repository'
import { collection, doc, getDoc, getDocs, Query, query, where } from 'firebase/firestore'
import { createPlannerConverter, Planner } from '@/lib/planner/type';
import { afterAll, assert, beforeAll, describe, expect, test } from 'vitest'
import { logInWithEmail, logOut } from '@/lib/auth/repository';
import { db } from "@/lib/shared/firebase-config"
import { User } from 'firebase/auth';
import { createTestPlanner, deleteTestPlanners } from '@/test/utils/planners';

const reference = collection(db, import.meta.env.VITE_FIRESTORE_PLANNER_DB)
let user: User;  
let readPlannerQuery: Query

describe("Planner - Repository ", () => {    
    // This function runs before the test cases have begun.
    beforeAll(async () => {
        const loggedInUser = await logInWithEmail({
            email: import.meta.env.VITE_ACCOUNT_TEST_A_EMAIL,
            password: import.meta.env.VITE_ACCOUNT_TEST_PASSWORD,
        })

        if (!loggedInUser) {
            throw new Error('Failed to authenticate test user')
        }

        user = loggedInUser; 

        readPlannerQuery = query(reference, where(`users.${user.uid}`, "in", [true, false])).withConverter(createPlannerConverter(user.uid));
    })

    // This function runs after all test cases are complete.
    afterAll(async () => {
        logOut();
        
        deleteTestPlanners()
    })


    test('Writing a new planner into a list of planners', async () => {
        // Gets the previous length of the user's visible queries
        let oldLength = (await getDocs(readPlannerQuery)).size

        // Calls the create test planner function which then calls the planner repository's writeNewPlanner function. 
        const testPlanner = await createTestPlanner(user.uid);

        // Gets the list of planners after new planner is added. 
        let newPlannerList = (await getDocs(readPlannerQuery)).docs.map((doc) => doc.data())

        // This checks if the newest planner exists from the list of planners. 
        let createdPlanner = newPlannerList.find((item) => 
            item.name == testPlanner.name && item.color == testPlanner.color
        )

        // Test cases which see if the new planner is added into the list.
        let newLength = newPlannerList.length
        expect(newLength, "New planner has not been added to the database").toEqual(oldLength + 1)

        assert(createdPlanner !== undefined, "New planner could not be found.")
    })

    test("Reading a list of planners from a listener", async () => {
        let previousPlanners = []
        let currentPlanners: Planner[] = []

        // This creates a listeners that places the old data into an array
        // with the new data being placed in the current planners array.
        let unSubFromPlanner = listenPlanners(user.uid, (newPlanners) => {
            previousPlanners = currentPlanners

            currentPlanners = newPlanners
        })

        // Creates a test planner to see if the 
        await createTestPlanner(user.uid)   

        // Unsubscribes the listener so resources aren't being taken. 
        unSubFromPlanner?.()
           
        
        // Runs the test scenario after a bit as updates take some time to load. 
        setTimeout(() => {            
            expect(currentPlanners.length, "Listener does not update on new changes").toEqual(previousPlanners.length + 1)
        }, 400)
    }, 400)

    test('Updating all attributes of a single planner', async () => { 
        // Creates a new test planner.
        let testPlanner = await createTestPlanner(user.uid);
        const oldPlanner = testPlanner; 

        await updatePlannerName({
            id: testPlanner.id, 
            name: `${testPlanner.id}-update`
        })

        await updatePlannerColor({
            id: testPlanner.id, 
            color: 'orange'
        })

        await updatePlannerVisibility({
            id: testPlanner.id, 
            userId: user.uid,
            visibility: !testPlanner.visible
        })

        // Gets the newest planner document'
        let plannerDoc = await getDoc(doc(db, import.meta.env.VITE_FIRESTORE_PLANNER_DB, testPlanner.id).withConverter(createPlannerConverter(user.uid)));
        let newPlanner = plannerDoc.data() as Planner;
        

        // Checks if the planner id has changed
        expect(oldPlanner.id, "Planner after update doesn't have the same id").toEqual(newPlanner.id)

        // Checks if the attributes have been changed. 
        expect(oldPlanner.name, "Planner after update has the same name").not.toEqual(newPlanner.name)
        expect(oldPlanner.color, "Planner after update has the same color").not.toEqual(newPlanner.color)
        expect(oldPlanner.visible, "Planner after update has the same visibility state").not.toEqual(newPlanner.visible)
        expect(oldPlanner.users, "Planner after update has the same user field.").not.toEqual(newPlanner.users)

        // Checks if the current users's visibility reflects the visible variable. 
        expect(newPlanner.users[user.uid], "Updated Planner's user visibility does not reflect visible field").toEqual(newPlanner.visible)
    })

    test('Deleting a planner from the list of planners', async () => {
        // Creates a new test planner.
        const testPlanner = await createTestPlanner(user.uid);

        // Gets the previous length of the user's visible queries
        let oldLength = (await getDocs(readPlannerQuery)).size

        await deletePlanner({
            id: testPlanner.id
        })

        // Gets the list of planners after new planner is added. 
        let plannerList: Planner[] = (await getDocs(readPlannerQuery)).docs.map((doc) => doc.data()) as Planner[]

        // This checks if the newest planner exists from the list of planners. 
        let deletedPlanner = plannerList.find((item) => 
            item.id == testPlanner.id
        )


        // Test cases which see if the new planner is deleted from the list.
        let newLength = plannerList.length
        expect(newLength, "New planner has not been deleted from the database").toEqual(oldLength - 1)
        expect(deletedPlanner, "New planner has not been deleted from the database").toBeUndefined()
    })
})