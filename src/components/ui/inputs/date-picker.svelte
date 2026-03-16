<script lang="ts">
    import { ArrowLeft, ArrowRight, Calendar } from "@lucide/svelte";
    import { DatePicker, TimeField } from "bits-ui";
    import { today, getLocalTimeZone, CalendarDateTime } from "@internationalized/date";
 
    // The picker receives the a bound date meaning that changes on one end leads to changes in the other side
    // Alongside this, a style modifier is given with a function that runs on the change of the date.
    interface PickerProps {
        value: CalendarDateTime,
        pickerStyle?: string
        buttonStyle?: string
        onChangeFn?: () => void
    }

    let { 
        value = $bindable(), 
        buttonStyle = "bg-background hover:bg-background-100 px-2",
        pickerStyle = "bg-background",
        onChangeFn
    }: PickerProps = $props()


    // To limit writes, debouncing is used to ensure that the function is only called after a small duration.
    let timer: ReturnType<typeof setTimeout>;

    function handleSubmit() {
        clearTimeout(timer);

        timer = setTimeout(() => {
            onChangeFn?.()
        }, 600)
    }
</script>
 
<DatePicker.Root 
    bind:value={value} 
    minValue={today(getLocalTimeZone())} 
    fixedWeeks={true}
    required
    onValueChange={handleSubmit}
    locale="en-AU"
>
    <!-- Input Selector for the Date Picker.$props -->
    <DatePicker.Input>
        {#snippet children({ segments })}
            <!-- Button to open the Calendar Picker. -->
            <DatePicker.Trigger class="{buttonStyle} h-full rounded-lg flex items-center gap-x-2 cursor-pointer">
                <Calendar class="size-4"/>
                
                <p>
                    {#each segments as { value }}
                        {value.toUpperCase()}
                    {/each}
                </p>
            </DatePicker.Trigger>
        {/snippet}
    </DatePicker.Input>

    <DatePicker.Content 
        side="top" 
        sideOffset={20} 
        collisionPadding={25}
        class="{pickerStyle} flex flex-col items-center border border-background-100 rounded-lg p-3"
    >
        <DatePicker.Calendar>
            {#snippet children({ months, weekdays })}
                <DatePicker.Header class="flex w-full items-center justify-between gap-x-2 pb-3">
                    <!-- Previous Button for the Calendar -->
                    <DatePicker.PrevButton class="cursor-pointer p-1.5 rounded-lg hover:bg-background-100 m-1 ml-1.5">
                        <ArrowLeft class="size-4"/>
                    </DatePicker.PrevButton>

                    <!-- Header for the -->
                    <DatePicker.Heading />

                    <!-- Next Button for the Calendar -->
                    <DatePicker.NextButton class="cursor-pointer p-1.5 rounded-lg hover:bg-background-100 m-1 mr-1.5">
                        <ArrowRight class="size-4"/>
                    </DatePicker.NextButton>
                </DatePicker.Header>

                {#each months as month}
                    <DatePicker.Grid class="w-full">
                        <!-- Headers for the Days of the Week -->
                        <DatePicker.GridHead>
                            <DatePicker.GridRow>
                                {#each weekdays as day}
                                    <DatePicker.HeadCell>
                                        {day}
                                    </DatePicker.HeadCell>
                                {/each}
                            </DatePicker.GridRow>
                        </DatePicker.GridHead>

                        <!-- Calendar -->
                        <DatePicker.GridBody>
                            {#each month.weeks as weekDates}
                                <DatePicker.GridRow>
                                    {#each weekDates as date}
                                        <DatePicker.Cell
                                            {date}
                                            month={month.value}
                                        >
                                            <DatePicker.Day class="
                                                rounded-lg cursor-pointer text-content-900 p-1.5 size-8 m-1 flex justify-center items-center hover:bg-background-100 transition-all
                                                data-selected:bg-content-900 data-selected:text-background-100  data-today:underline
                                                data-disabled:text-content-600/30 data-outside-month:pointer-events-none data-disabled:pointer-events-none
                                            ">
                                                {date.day}
                                            </DatePicker.Day>
                                        </DatePicker.Cell>
                                    {/each}
                                </DatePicker.GridRow>
                            {/each}
                        </DatePicker.GridBody>
                    </DatePicker.Grid>
                {/each}
            {/snippet}
        </DatePicker.Calendar>

        <TimeField.Root 
            bind:value={value}
            onValueChange={handleSubmit}
        >
            <TimeField.Label class="text-sm pt-2">Time:</TimeField.Label>
            
            <TimeField.Input class="flex items-center">
                {#snippet children({ segments })}
                    {#each segments as { part, value }}
                            {#if part !== "literal"}
                                <TimeField.Segment {part} class="p-1 min-w-8 text-center hover:bg-background-100 rounded-lg transition-colors">
                                    {value}
                                </TimeField.Segment>
                            {/if}

                            {#if part === "literal" && value !== ""}
                                <TimeField.Segment {part}>
                                    {value}
                                </TimeField.Segment>
                            {/if}
                    {/each}
                {/snippet}
            </TimeField.Input>
        </TimeField.Root>
    </DatePicker.Content>
</DatePicker.Root>
