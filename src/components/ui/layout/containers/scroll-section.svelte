<script lang="ts">
    import { ScrollArea, type WithoutChild } from "bits-ui";

    type ScrollProps = WithoutChild<ScrollArea.RootProps> & {
        viewportClasses?: string;
    };
    
    let { 
        ref = $bindable(null),
        children,
        viewportClasses,
        ...restProps
    }: ScrollProps = $props()
</script>

<!-- This creates a scroll area that on hover shows a custom scrollbar -->
<ScrollArea.Root 
    bind:ref 
    type="hover" 
    {...restProps}
>
    <ScrollArea.Viewport class={viewportClasses}>
        {@render children?.()}
    </ScrollArea.Viewport>

    <ScrollArea.Scrollbar
        orientation="vertical"
        class="w-2"
    >
        <ScrollArea.Thumb class="bg-background-300 flex-1 h-80"/>
    </ScrollArea.Scrollbar>
</ScrollArea.Root>