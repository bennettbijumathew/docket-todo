import { deletePlanner, listenPlanners, updatePlannerColor, updatePlannerName, updatePlannerVisibility } from '@/lib/planner/repository'
import { collection, doc, getDoc, getDocs, Query, query, where } from 'firebase/firestore'
import { createTestPlanner, deleteTestPlanners } from '@/test/utils/planners';
import { afterEach, assert, beforeEach, describe, expect, test } from 'vitest'
import { createPlannerConverter, Planner } from '@/lib/planner/type';
import { logInWithEmail, logOut } from '@/lib/auth/repository';
import { testUserA } from '@/test/utils/test-users';
import { db } from "@/lib/shared/firebase-config"
import { User } from 'firebase/auth';

describe("Planner - Repository", () => {    
    let testUser: User;  
    let readPlannerQuery: Query

    // This function runs before the test cases have begun.
    beforeEach(async () => {
        const loggedInUser = await logInWithEmail({
            email: testUserA.email,
            password: testUserA.password,
        })

        // Places new test user as newly logged in user.
        if (loggedInUser == null) {
            throw new Error('Failed to authenticate test user')
        }

        testUser = loggedInUser

        // Once the user id is collected, the query grabs planners related to the user.
        readPlannerQuery = query(
            collection(db, import.meta.env.VITE_FIRESTORE_PLANNER_DB), 
            where(`users.${testUser.uid}`, "in", [true, false])
        ).withConverter(createPlannerConverter(testUser.uid));
    })

    // This function runs after all test cases are complete.
    afterEach(async () => {
        logOut();
        deleteTestPlanners()
    })


    test('Writing a new planner into a list of planners', async () => {
        // Gets the previous length of the user's visible queries
        let oldLength = (await getDocs(readPlannerQuery)).size

        // Calls the create test planner function which then calls the planner repository's writeNewPlanner function. 
        const testPlanner = await createTestPlanner(testUser.uid);

        // Gets the list of planners after new planner is added. 
        let newPlannerList = (await getDocs(readPlannerQuery)).docs.map((doc) => doc.data())

        // This checks if the newest planner exists from the list of planners. 
        let createdPlanner = newPlannerList.find((item) => 
            item.name == testPlanner.name
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
        let unSubFromPlanner = listenPlanners(testUser.uid, (newPlanners) => {
            previousPlanners = currentPlanners

            currentPlanners = newPlanners
        })

        // Creates a test planner to see if the 
        await createTestPlanner(testUser.uid)   

        // Unsubscribes the listener so resources aren't being taken. 
        unSubFromPlanner?.()
           
        
        // Runs the test scenario after a bit as updates take some time to load. 
        setTimeout(() => {            
            expect(currentPlanners.length, "Listener does not update on new changes").toEqual(previousPlanners.length + 1)
        }, 400)
    }, 400)

    test('Updating all attributes of a single planner', async () => { 
        // Creates a new test planner.
        let testPlanner = await createTestPlanner(testUser.uid);
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
            userId: testUser.uid,
            visibility: !testPlanner.visible
        })

        // Gets the newest planner document'
        let plannerDoc = await getDoc(doc(db, import.meta.env.VITE_FIRESTORE_PLANNER_DB, testPlanner.id).withConverter(createPlannerConverter(testUser.uid)));
        let newPlanner = plannerDoc.data() as Planner;
        

        // Checks if the planner id has changed
        expect(oldPlanner.id, "Planner after update doesn't have the same id").toEqual(newPlanner.id)

        // Checks if the attributes have been changed. 
        expect(oldPlanner.name, "Planner after update has the same name").not.toEqual(newPlanner.name)
        expect(oldPlanner.color, "Planner after update has the same color").not.toEqual(newPlanner.color)
        expect(oldPlanner.visible, "Planner after update has the same visibility state").not.toEqual(newPlanner.visible)
        expect(oldPlanner.users, "Planner after update has the same user field.").not.toEqual(newPlanner.users)

        // Checks if the current users's visibility reflects the visible variable. 
        expect(newPlanner.users[testUser.uid], "Updated Planner's user visibility does not reflect visible field").toEqual(newPlanner.visible)
    })

    test('Deleting a planner from the list of planners', async () => {
        // Creates a new test planner.
        const testPlanner = await createTestPlanner(testUser.uid);

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