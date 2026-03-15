<script lang="ts">
    import { getPlatform } from "@/components/util/platform";
    import type { Snippet } from "svelte";

    interface LayoutProps {
        children?: Snippet,
    }

    let { 
        children,
    }: LayoutProps = $props()
</script>

<section class="
    flex flex-col flex-3 p-6
">
    <!-- This section adds padding for the windows application -->
    {#if getPlatform() === "windows"}
        <div class="h-6"></div>
    {/if}

    {@render children?.()}
</section>
