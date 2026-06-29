<script lang="ts">
    import { Accordion } from "bits-ui";
    import { type Snippet } from "svelte";
    import { slide } from "svelte/transition";

    interface AccordionItemProps {
        children: Snippet,
        title: string
        triggerClasses: string
        contentClasses: string
    }
    
    let { 
        children,
        title, 
        triggerClasses, 
        contentClasses
    }: AccordionItemProps = $props()
</script>

<Accordion.Item
    value={title}
>
    <Accordion.Header> 
        <Accordion.Trigger class={triggerClasses}>
            {title}
        </Accordion.Trigger>
    </Accordion.Header>

    <Accordion.Content forceMount={true}>
        {#snippet child({ open })}
            {#if open}
                <div 
                    class={contentClasses}
                    transition:slide={{ duration: 400 }}
                >   
                    {@render children()}
                </div>
            {/if}
        {/snippet}
    </Accordion.Content>
</Accordion.Item>