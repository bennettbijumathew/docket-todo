<script lang="ts">
    import { ArrowLeft, ArrowRight, Calendar } from "@lucide/svelte";
    import { DatePicker } from "bits-ui";
    import { today, getLocalTimeZone } from "@internationalized/date";
 
    const todayDate = today(getLocalTimeZone());

</script>
 
<DatePicker.Root minValue={todayDate} fixedWeeks={true}>
    <!-- Input Selector for the Date Picker.$props -->
    <DatePicker.Input class="flex items-center hover:bg-background-100 rounded-lg px-2">
        {#snippet children({ segments })}
            <!-- Button to open the Calendar Picker. -->
            <DatePicker.Trigger class="cursor-pointer pr-1 flex items-center">
                <Calendar class="size-4 mr-2"/>
                
                {#each segments as { value }}
                    {value.toUpperCase()}
                {/each}
            </DatePicker.Trigger>
        {/snippet}
    </DatePicker.Input>

    <DatePicker.Content side="top" sideOffset={25}>
        <DatePicker.Calendar class="flex flex-col items-center border border-background-300 bg-background-50 rounded-lg p-3">
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
                        <DatePicker.GridHead>
                            <DatePicker.GridRow>
                                {#each weekdays as day}
                                    <DatePicker.HeadCell>
                                        {day}
                                    </DatePicker.HeadCell>
                                {/each}
                            </DatePicker.GridRow>
                        </DatePicker.GridHead>

                        <DatePicker.GridBody>
                            {#each month.weeks as weekDates}
                                <DatePicker.GridRow class="">
                                    {#each weekDates as date}
                                        <!-- <DatePicker.Cell {date} month={month.value}>
                                            <DatePicker.Day class="text-center p-1.5 rounded-lg cursor-pointer hover:bg-background-100"/>
                                        </DatePicker.Cell> -->


                                        <DatePicker.Cell
                                            {date}
                                            month={month.value}
                                        >
                                            <DatePicker.Day class="
                                                rounded-lg cursor-pointer text-content-900 p-1.5 size-8 m-1 flex justify-center items-center
                                                hover:bg-background-100 
                                                data-selected:bg-content-900 data-selected:text-background-100  
                                                data-disabled:text-content-600/30
                                                data-outside-month:pointer-events-none data-disabled:pointer-events-none
                                                group relative whitespace-nowrap text-sm font-normal transition-all
                                                data-today:underline
                                            ">
                                                {date.day}
                                            </DatePicker.Day>
                                        </DatePicker.Cell>

                                        
                                        <!-- <DatePicker.Cell
                                            {date}
                                            month={month.value}
                                            class="p-0! relative size-10 text-center text-sm"
                                        >
                                            <DatePicker.Day
                                                class="rouded-n9px text-foreground hover:border-foreground data-selected:bg-orange-400 data-disabled:text-orange-400/30 data-selected:text-yellow-400 data-unavailable:text-muted-foreground data-disabled:pointer-events-none data-outside-month:pointer-events-none data-selected:font-medium data-unavailable:line-through group relative inline-flex size-10 items-center justify-center whitespace-nowrap border border-transparent bg-transparent p-0 text-sm font-normal transition-all"
                                            >
                                                <div
                                                    class="bg-red-400 group-data-selected:bg-background group-data-today:block absolute top-[5px] hidden size-1 rounded-full transition-all"
                                                ></div>
                                                {date.day}
                                            </DatePicker.Day>
                                        </DatePicker.Cell> -->

                                    {/each}
                                </DatePicker.GridRow>
                            {/each}
                        </DatePicker.GridBody>
                    </DatePicker.Grid>
                {/each}
            {/snippet}
        </DatePicker.Calendar>
    </DatePicker.Content>
</DatePicker.Root>
