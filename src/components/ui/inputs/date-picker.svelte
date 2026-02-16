<script lang="ts">
    import { ArrowLeft, ArrowRight, Calendar } from "@lucide/svelte";
    import { DatePicker, TimeField } from "bits-ui";
    import { today, getLocalTimeZone, CalendarDateTime } from "@internationalized/date";
 
    const todayDate = today(getLocalTimeZone());

     let { value = $bindable() }: { value: CalendarDateTime } = $props()
</script>
 
<DatePicker.Root 
    bind:value={value} 
    minValue={todayDate} 
    fixedWeeks={true}
    required
>
    <!-- Input Selector for the Date Picker.$props -->
    <DatePicker.Input class="flex items-center hover:bg-background-100 rounded-lg px-2 text-center mx-8">
        {#snippet children({ segments })}
            <!-- Button to open the Calendar Picker. -->
            <DatePicker.Trigger class="cursor-pointer pr-1 flex items-center">
                <Calendar class="size-4 mr-2"/>
                
                <div class="border-b hover:border-0 border-background-100">
                    {#each segments as { value }}
                        {value.toUpperCase()}
                    {/each}
                </div>
            </DatePicker.Trigger>
        {/snippet}
    </DatePicker.Input>

    <DatePicker.Content 
        side="top" 
        sideOffset={25} 
        class="flex flex-col items-center border border-background-300 bg-background-50 rounded-lg p-3"
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

        <TimeField.Root bind:value={value}>
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
