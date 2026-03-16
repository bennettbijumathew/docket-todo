<script lang="ts">
    import type { Planner } from '@/lib/planner/type';
    import Checkbox from '../../inputs/checkbox.svelte';
    import { plannerRepo } from '@/lib/planner/repository';
    import { authStore } from '@/lib/auth/store.svelte';
    import { colors } from '@/components/util/color';
    import { plannerStore } from '@/lib/planner/store.svelte';
</script>

<!-- COMPONENT: This is planner tile snippet that is used to show a single task in a list -->
{#snippet plannerTile(planner: Planner)}
    <!-- Since visibility is tracked in the users field, the user id is used to alter the user's visible status of the planner. -->
    <button
        onclick={() => plannerRepo.editVisibility(authStore.getUserId(), planner.id, !planner.users[authStore.getUserId()])}
        aria-label="Checkbox for hiding / showing the planner '{planner.name}'"
        class="
            inline-flex gap-x-2 p-2 rounded-md transition-colors bg-background hover:bg-background-50 hover:cursor-pointer
            sm:p-1
            scrollbar-hover:bg-red-500
        "
    >
        <!-- Value of the checkbox updates on pressing the outer button. This works due to the planner being used a svelte state variable  -->
        <Checkbox 
            value={planner.users[authStore.getUserId()]} 
            checkedStyle="size-5 bg-{colors[planner.color]}"
            unCheckedStyle="size-5 border-{colors[planner.color]}"
        />

        <p class="truncate text-left"> {planner.name} </p>
    </button>
{/snippet}

<!-- VIEW: The sidebar structure has the website's logo and navigation links -->
<h2 class="font-title font-semibold text-lg"> Planners </h2>

<div class="
    flex flex-col flex-1 overflow-y-scroll gap-y-1 h-fit 
    scrollbar-thin scrollbar-track-background
">
    {#each plannerStore.getList() as planner, index (index)}
        {@render plannerTile(planner)}
    {/each}
</div>
