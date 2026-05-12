import { NotifWithDate, RemoveNotif, Scheduler } from "@/lib/notification/type";
import { cancelNotif, sendWindowsNotif } from "@/lib/notification/repository";
import { getLocalTimeZone } from "@internationalized/date";

// This is a notification scheduler used for the windows users. It sends notifications using
// tauri-plugin-notification while using timeouts to schedule the notification timing.
export class WindowsScheduler implements Scheduler {
    timeoutList: Map<number, ReturnType<typeof setTimeout>> = new Map();

    // Pushes a timeout that on finish sends a tauri notification. 
    push ({ id, title, body, dueDate }: NotifWithDate) {
        // If a timeout exists at the index, it is cleared to allow for new timing of the notification.
        const existingTimeout = this.timeoutList.get(id)

        if (existingTimeout) {
            clearTimeout(existingTimeout)
        }

        // Calculates the delay between today and the due date.
        const today = new Date().getTime()
        const delay = dueDate.toDate(getLocalTimeZone()).getTime() - today

        // This sets a new timeout in the list that only runs the function once the delay is complete. 
        this.timeoutList.set(id, setTimeout(() => {     

            // Notification is created or replaced if the same id was used in a previous sendNotification() call. 
            sendWindowsNotif({ id, title, body})

            // Deletes the timeout as it has been completed. 
            this.pop({ id })
        }, delay))
    }

    // Clears the notification and the timeout to ensure notification is not run.
    pop({ id }: RemoveNotif) {
        cancelNotif({ id })

        // Deletes the timeout from the list of timeouts
        this.timeoutList.delete(id)
    }
}