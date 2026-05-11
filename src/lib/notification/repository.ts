import { CalendarDateTime, getLocalTimeZone } from "@internationalized/date";
import { cancel, Schedule, sendNotification } from "@tauri-apps/plugin-notification";
import { AndroidNotif, WindowsNotif } from "@/lib/notification/type";

// This functions sends a notification using Tauri's notification plugin. 
// On android, the plugin is able to schedule notifications. 
export function sendAndroidNotif({id, title, body, dueDate}: AndroidNotif) {
    const schedule = Schedule.at(dueDate.toDate(getLocalTimeZone()))

    sendNotification({id, title, body, schedule})
}   


// This functions sends a notification using Tauri's notification plugin. 
// On windows, the plugin is not able to schedule notifications. 
export function sendWindowsNotif({id, title, body}: WindowsNotif) {
    sendNotification({id, title, body})
}   


// This function cancels a tauri notification using the notification's number id
type CancelNotif = {
    id: number
}

function cancelNotif({id}: CancelNotif) {
    cancel([id])
}