<script lang="ts">
    import { app } from "@/lib/app/main";
    import type { Snippet } from "svelte";

    interface LayoutProps {
        children?: Snippet,
    }

    let { 
        children,
    }: LayoutProps = $props()
</script>

<!-- Adds padding for the windows application so that window bar has the same background. -->
<section class="
    flex flex-col flex-3 p-6 
    {(app.platform === "windows" || app.platform === "android" ) ? "sm:pt-12" : ""}
">
    {@render children?.()}
</section>
