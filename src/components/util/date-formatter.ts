import { CalendarDateTime, DateFormatter, getLocalTimeZone } from "@internationalized/date";

export const dateFormatter = new DateFormatter("en-US", {
    dateStyle: "full",
    timeStyle: "short",
})

export function formatLongDate(date: CalendarDateTime) {
    return dateFormatter.format(date.toDate(getLocalTimeZone()))
}