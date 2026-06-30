<script lang="ts">
    import { ChevronDown } from "@lucide/svelte";
    import { slide } from "svelte/transition";
    import { type Snippet } from "svelte";
    import { Accordion } from "bits-ui";

    interface AccordionItemProps {
        children: Snippet,
        title: string,
        subText?: string,
        triggerClasses: string
        contentClasses: string
    }
    
    let { 
        children,
        title, 
        subText,
        triggerClasses, 
        contentClasses
    }: AccordionItemProps = $props()
</script>

<Accordion.Item
    value={title}
>
    <Accordion.Header> 
        <Accordion.Trigger class="{triggerClasses} flex items-center cursor-pointer px-2 gap-x-2 [&[data-state=open]>svg]:rotate-180">
            <ChevronDown class="size-4 transition-all duration-300"/>

            <span class="capitalize flex items-center gap-x-1">
                <p> {title} </p>

                {subText}
            </span>
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