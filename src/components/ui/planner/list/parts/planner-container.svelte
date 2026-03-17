<script lang="ts">
    import { type Snippet } from "svelte";

    // These props are received from the caller using the component. 
    // A child element is given so that it can be rendered later.
    interface ContainerProps {
        children: Snippet,
    }

    let { children: plannerGroup }: ContainerProps = $props() 
</script>

<!-- This area renders the children element that is given by the caller -->
<!-- This would usually hold a group of planners -->
<div class="
    flex-1 flex flex-col overflow-y-scroll gap-y-4 my-6
    sm:max-h-none sm:scrollbar-thin sm:scrollbar-track-background
">      
    {@render plannerGroup()}
</div>
