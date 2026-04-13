<!-- CODE -->
<script lang="ts">
    import Sidebar from "@/components/ui/layout/_user/sidebar.svelte";
    import { type Snippet } from "svelte";
    
    interface LayoutProps {
        children: Snippet
    }

    let { children }: LayoutProps = $props()
</script>

<!-- VIEW -->
<main class="
    flex flex-col flex-1 inset *:inset-shadow-b-md
    sm:min-h-0 sm:flex-row *:sm:inset-shadow-l-md
">
    <Sidebar/>

    {@render children()}
</main>
