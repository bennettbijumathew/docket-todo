<script lang="ts">
    import { Check } from "@lucide/svelte";
    import { Checkbox } from "bits-ui";

    // The checkbox takes a boolean value and a optional onchange function. 
    // The styles variables are used to customize the height and coloring of the checkbox.
    interface CheckboxProps {
        value: boolean, 
        onChangeFn?: () => void
        checkedStyle?: string
        unCheckedStyle?: string
    }

    let { 
        value, 
        onChangeFn, 
        checkedStyle = "size-5 bg-content-900 text-background", 
        unCheckedStyle = "size-5 border-content-900"
    }: CheckboxProps = $props()
</script>
 
<Checkbox.Root
    class="inline-flex items-center justify-center rounded-md"
    checked={value}
    onCheckedChange={onChangeFn}
>
    {#if value === true}
        <div class="{checkedStyle} cursor-pointer inline-flex items-center justify-center rounded-md hover:opacity-90">
            <Check class="size-fit m-0.5" strokeWidth={3}/>
        </div>
    {:else}
        <div class="{unCheckedStyle} cursor-pointer border inline-flex items-center justify-center rounded-md"></div>
    {/if}
</Checkbox.Root>