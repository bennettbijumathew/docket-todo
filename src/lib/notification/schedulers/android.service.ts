import { NotifWithDate, RemoveNotif, Scheduler } from "@/lib/notification/type";
import { cancelNotif, sendAndroidNotif } from "@/lib/notification/repository";

export class AndroidScheduler implements Scheduler {    
    push ({ id, title, body, dueDate }: NotifWithDate) {
        sendAndroidNotif({ id, title, body, dueDate})
    }

    pop({ id }: RemoveNotif) {
        cancelNotif({ id })
    }
}