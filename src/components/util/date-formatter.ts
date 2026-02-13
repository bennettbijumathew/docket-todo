import { DateFormatter } from "@internationalized/date";

export const dateFormatter = new DateFormatter("en-US", {
    dateStyle: "full",
    timeStyle: "short",
})