<script lang="ts">
    import { ArrowLeft, ArrowRight, Calendar } from "@lucide/svelte";
    import { DatePicker, TimeField } from "bits-ui";
    import { today, getLocalTimeZone, CalendarDateTime } from "@internationalized/date";
 
    // The picker receives the a bound date meaning that changes on one end leads to changes in the other side
    // Alongside this, a style modifier is given with a function that runs on the change of the date.
    interface PickerProps {
        value: CalendarDateTime,
        triggerClass?: string
        onChangeFn?: () => void
    }

    let { 
        value = $bindable(), 
        triggerClass = "",
        onChangeFn
    }: PickerProps = $props()

    function changeTimePeriod(dayPeriod: string) {
        if (dayPeriod == "AM") {
            value = value.add({hours: 12})
        }
        else if (dayPeriod == "PM") {
            value = value.subtract({hours: 12})
        }
    }
</script>
 
<DatePicker.Root 
    bind:value={value} 
    minValue={today(getLocalTimeZone()).subtract({years: 30})} 
    maxValue={today(getLocalTimeZone()).add({years: 30})} 
    fixedWeeks={true}
    onOpenChangeComplete={() => onChangeFn?.()}
    // onValueChange={handleSubmit}
    locale="en-AU"
    required
    disableDaysOutsideMonth={false}
>
    <!-- Input Selector for the Date Picker. -->
    <DatePicker.Input>
        {#snippet children({ segments })}
            <DatePicker.Trigger class="{triggerClass} flex justify-between items-center gap-x-2 cursor-pointer">
                <Calendar class="size-4"/>
                
                <p class="
                    text-right
                    text-xs
                    sm:text-sm
                ">
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
        class="bg-background shadow-md flex flex-col items-center rounded-lg p-3"
    >
        <DatePicker.Calendar>
            {#snippet children({ months, weekdays })}
                <DatePicker.Header class="flex w-full items-center justify-between gap-x-2 pb-3">
                    <!-- Previous Button for the Calendar -->
                    <DatePicker.PrevButton class="cursor-pointer p-1.5 rounded-lg hover:bg-background-100 data-disabled:text-content-600/30 m-1 ml-1.5">
                        <ArrowLeft class="size-4"/>
                    </DatePicker.PrevButton>

                    <!-- Header for the Calendar -->
                    <DatePicker.Heading />

                    <!-- Next Button for the Calendar -->
                    <DatePicker.NextButton class="cursor-pointer p-1.5 rounded-lg hover:bg-background-100 data-disabled:text-content-600/30 m-1 mr-1.5">
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
                                                data-selected:bg-content-900 data-selected:text-background-100 data-today:underline data-disabled:text-content-600/30
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
        >
            <TimeField.Label class="text-sm pt-2">Time:</TimeField.Label>
            
            <TimeField.Input class="flex items-center">
                {#snippet children({ segments })}
                    {#each segments as { part, value }}
                        {#if part == "hour" || part == "minute" }
                            <TimeField.Segment 
                                part={part} 
                                class="p-0.5 min-w-6 text-center hover:bg-background-100 outline-background-400 rounded-lg transition-colors"
                            >
                                {value}
                            </TimeField.Segment>
                        {:else if part == "literal"}
                            <TimeField.Segment 
                                part={part}
                                class="mx-0.5" 
                            >
                                {value}
                            </TimeField.Segment>
                        {:else if part == "dayPeriod"}
                            <button 
                                class="p-0.5 min-w-8 text-center hover:bg-background-100 outline-background-400 rounded-lg transition-colors cursor-pointer"
                                aria-label="Toggles the day period from {value} to {value == "PM" ? "AM" : "PM"}"
                                onclick={(e) => {
                                    e.preventDefault()
                                    changeTimePeriod(value)
                                }}
                            >
                                {value}
                            </button>
                        {/if}
                    {/each}
                {/snippet}
            </TimeField.Input>
        </TimeField.Root>
    </DatePicker.Content>
</DatePicker.Root>
