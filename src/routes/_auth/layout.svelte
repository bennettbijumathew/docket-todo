
<script lang="ts">
    import { getPlatform } from "@/components/util/platform";
    import type { Snippet } from "svelte";
    import { Toaster } from "svelte-sonner";

    interface LayoutProps {
        children?: Snippet,
    }

    let { 
        children,
    }: LayoutProps = $props()
</script>

{@render children?.()}

<!-- The auth controller sends toasts on errors found. A notification is shown within the page -->
<Toaster 
    richColors={true}
    toastOptions={{
        unstyled: true,
        classes: {
            toast: `border-0 flex justify-between items-center gap-x-6 p-4 py-3 rounded-lg shadow-md ${getPlatform() === "android" ? "mt-8" : ""}`,
            title: 'font-default',
        }
    }}
    offset={getPlatform() === "android" ? "100px" : undefined}
    position={getPlatform() === "android" ? "top-center" : "bottom-right"}
/>
