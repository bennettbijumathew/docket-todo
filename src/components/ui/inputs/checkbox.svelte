<script lang="ts">
    import { Check } from "@lucide/svelte";
    import { Checkbox } from "bits-ui";

    // The checkbox takes a boolean value and a optional onchange function. 
    // The styles variables are used to customize the height and coloring of the checkbox.
    // The disabled variable controls if the input is disabled.
    interface CheckboxProps {
        value: boolean, 
        onclick?: () => void
        onChangeFn?: () => void
        checkedStyle?: string
        unCheckedStyle?: string
        disabled?: boolean
        stopPropagation?: boolean, 
        ariaLabel?: string
    }

    let { 
        value, 
        onChangeFn, 
        checkedStyle = "size-5 bg-content-900 text-background", 
        unCheckedStyle = "size-5 border-content-900",
        disabled = false,
        stopPropagation = false, 
        ariaLabel = ""
    }: CheckboxProps = $props()
</script>
 
<Checkbox.Root
    class="inline-flex items-center justify-center rounded-sm cursor-pointer data-disabled:cursor-not-allowed data-disabled:bg-red-200"
    checked={value}
    onCheckedChange={onChangeFn}
    onclick={(event) => stopPropagation === true ? event.stopPropagation() : null}
    disabled={disabled}
    aria-label={ariaLabel}
>
    {#if value === true}
        <div class="{checkedStyle} inline-flex items-center justify-center rounded-sm hover:opacity-90">
            <Check class="size-fit m-0.5" strokeWidth={3}/>
        </div>
    {:else}
        <div class="{unCheckedStyle} border inline-flex items-center justify-center rounded-sm">
            <Check class="opacity-0 hover:opacity-100 transition-opacity size-fit m-0.5"/>

        </div>
    {/if}
</Checkbox.Root>