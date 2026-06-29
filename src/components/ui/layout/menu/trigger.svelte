<script lang="ts">
    import { ContextMenu } from "bits-ui";
    import { type Snippet } from "svelte";

    type TriggerProps = { 
        children?: Snippet,
        onLeftClick: (e: MouseEvent) => void,
        onRightClick: (e: MouseEvent) => void,
        triggerClasses: string, 
        ariaLabel: string 
    }

    let { children, onLeftClick, onRightClick, triggerClasses, ariaLabel }: TriggerProps = $props()
</script>

<!-- This is structure of the trigger to open the context menu -->
<ContextMenu.Trigger 
    onclick={onLeftClick}
    oncontextmenu={onRightClick}
    class={triggerClasses}
    aria-label={ariaLabel}
>
    {@render children?.()}
</ContextMenu.Trigger>
