import { type Icon } from "@lucide/svelte"

export type MenuItem = {
    name: string,
    function: () => void, 
    icon: typeof Icon,
    disabled: boolean
}
