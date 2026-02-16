export const colors = {
    red: "red-400",
    orange: "orange-400",
    amber: "amber-400",
    yellow: "yellow-400",
    lime: "lime-400",
    green: "green-400",
    emerald: "emerald-400",
    teal: "teal-400",
    cyan: "cyan-400",
    sky: "sky-400",
    blue: "blue-400",
    indigo: "indigo-400",
    violet: "violet-400",
    purple: "purple-400",
    pink: "pink-400",
    rose: "rose-400"
} as const;


export type ColorKey = keyof typeof colors;
