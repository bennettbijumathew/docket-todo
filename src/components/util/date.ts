import { CalendarDateTime, DateFormatter, getLocalTimeZone } from "@internationalized/date";
import type { Timestamp } from "firebase/firestore";

export const dateFormatter = new DateFormatter("en-US", {
    dateStyle: "full",
    timeStyle: "short",
})

export function formatLongDate(date: CalendarDateTime) {
    return dateFormatter.format(date.toDate(getLocalTimeZone()))
}

export function firestoreToCalendarDateTime(timestamp: Timestamp): CalendarDateTime {
    const date = timestamp.toDate();
    
    return new CalendarDateTime(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
    );
}
