import { CalendarDateTime, getLocalTimeZone } from "@internationalized/date";
import { isPermissionGranted, requestPermission, sendNotification, Schedule } from "@tauri-apps/plugin-notification";
import { toast } from "svelte-sonner";

interface NotificationProps {
    id?: number
    title: string, 
    body?: string, 
    date?: CalendarDateTime
}

export async function sendNewNotification({id, title, body, date}: NotificationProps) {
    // Do you have permission to send a notification?
    let permissionGranted = await isPermissionGranted();

    // If not we need to request it
    if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === 'granted';
    }

    // Once permission has been granted we can send the notification
    if (permissionGranted) {
        sendNotification({ 
            id: id !== undefined ? id : undefined,
            title: title, 
            body: body !== undefined ? body : undefined,
            schedule: date !== undefined ? Schedule.at(date.toDate(getLocalTimeZone())) : undefined
        });
    }
}