<script lang="ts">
    import { ScrollArea } from "bits-ui";
    import { type Snippet } from "svelte";

    interface ScrollProps {
        children?: Snippet,
        rootClasses: string, 
        viewportClasses: string,    
    }
    
    let { 
        children,
        rootClasses,
        viewportClasses
    }: ScrollProps = $props()
</script>

<!-- This creates a scroll area that on hover shows a custom scrollbar -->
<ScrollArea.Root 
    type="hover" 
    class={rootClasses}
>
    <ScrollArea.Viewport class={viewportClasses}>
        {@render children?.()}
    </ScrollArea.Viewport>

    <ScrollArea.Scrollbar
        orientation="vertical"
        class="w-2 border-l"
    >
        <ScrollArea.Thumb
            class="bg-black flex-1 h-80"
        />
    </ScrollArea.Scrollbar>
</ScrollArea.Root>