<script lang="ts">
    import { ContextMenu } from "bits-ui";
    import { type Snippet } from "svelte";
    import { type MenuItem } from "@/components/ui/layout/menu/type";

    type RootProps = { 
        children?: Snippet 
        items: MenuItem[]
    }

    let { children, items }: RootProps = $props()
</script>

<!-- This is structure of the root and item list of the context menu -->
<ContextMenu.Root>
    {@render children?.()}
    
    <ContextMenu.Content
        class="bg-background p-2 shadow-md rounded-lg"
    >
        {#each items as item}
            {@const ItemIcon = item.icon}

            <ContextMenu.Item 
                onclick={item.function}
                class="flex items-center gap-x-2 p-1 px-2 hover:bg-background-100 rounded-lg cursor-pointer data-disabled:hidden"
                disabled={item.disabled}
            >   
                <ItemIcon class="size-4"/>

                {item.name}
            </ContextMenu.Item>
        {/each}
    </ContextMenu.Content>
</ContextMenu.Root>
