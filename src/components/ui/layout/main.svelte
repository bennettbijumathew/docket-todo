<script lang="ts">
    import type { Snippet } from "svelte";

    interface LayoutProps {
        children?: Snippet,
    }

    let { 
        children,
    }: LayoutProps = $props()
</script>

<section class="flex flex-col flex-3 p-6">
    {@render children?.()}
</section>
