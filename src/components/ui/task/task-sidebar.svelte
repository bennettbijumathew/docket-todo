<script lang="ts">
    import type { Planner } from '@/lib/planner/type';
    import Checkbox from '@/components/ui/inputs/checkbox.svelte';
    import { authentication } from '@/lib/auth/store.svelte';
    import { colors } from '@/components/util/color';
    import { planners } from '@/lib/planner/store.svelte';
    import { editPlannerVisibility } from '@/lib/planner/service';
    import SidebarRoot from '@/components/ui/layout/sidebar/root.svelte';
    import ScrollSection from '@/components/ui/layout/containers/scroll-section.svelte';
</script>

<!-- COMPONENT: This is planner tile snippet that is used to show a single task in a list -->
{#snippet plannerTile(planner: Planner)}
    <!-- Since visibility is tracked in the users field, the user id is used to alter the user's visible status of the planner. -->
    <button
        onclick={() => {
            editPlannerVisibility({
                id: planner.id, 
                visibility: !planner.visible
            }) 
        }}
        aria-label="Checkbox for hiding / showing the planner '{planner.name}'"
        class="
            inline-flex gap-x-2 p-2 rounded-md transition-colors bg-background hover:bg-background-50 hover:cursor-pointer
            sm:p-1
            scrollbar-hover:bg-red-500
        "
    >
        <!-- Value of the checkbox updates on pressing the outer button. This works due to the planner being used a svelte state variable  -->
        <Checkbox 
            value={planner.users[authentication.userId]} 
            checkedStyle="size-5 bg-{colors[planner.color]}"
            unCheckedStyle="size-5 border-{colors[planner.color]}"
        />

        <p class="truncate text-left"> {planner.name} </p>
    </button>
{/snippet}

<SidebarRoot>
    <h2 class="font-title font-semibold text-lg"> Planners </h2>

    <ScrollSection  
        class="flex-1 min-h-0 h-full"
        viewportClasses="h-full mb-4"
    >  
        <div class="flex flex-col">
            {#each planners.all as planner, index (index)}
                {@render plannerTile(planner)}
            {/each}
        </div>
    </ScrollSection>
</SidebarRoot>