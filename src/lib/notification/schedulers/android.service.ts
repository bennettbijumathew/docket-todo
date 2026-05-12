import { NotifWithDate, RemoveNotif, Scheduler } from "@/lib/notification/type";
import { cancelNotif, sendAndroidNotif } from "@/lib/notification/repository";

// This is a notification scheduler used for the android users. Since tauri-plugin-notification allows
// scheduling for Android, timeouts are not used to schedule notifications. 
export class AndroidScheduler implements Scheduler {  
    // Sends a tauri notification with a schedule release time.   
    async push ({ id, title, body, dueDate }: NotifWithDate) {
        await sendAndroidNotif({ id, title, body, dueDate})
    }

    // Clears the notification and the timeout to ensure notification is not run.
    pop({ id }: RemoveNotif) {
        cancelNotif({ id })
    }
}