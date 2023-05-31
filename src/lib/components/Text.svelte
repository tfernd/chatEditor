<script lang="ts">
  import Textarea from './Textarea.svelte'
  import { rawText, selection, output } from '$lib/store'
  import { getSelectedTextBounds, updateSelectionOnKeyPress } from '$lib/utils'

  export let loading: boolean = false
</script>

<div class="text" class:loading>
  <Textarea
    showWordCount={true}
    bind:value={$rawText}
    on:mouseup={(event) => {
      $selection = getSelectedTextBounds(event)
      $output = [] // reset
    }}
    on:keyup={(event) => {
      $selection = updateSelectionOnKeyPress(event)
      $output = [] // reset
    }} />
</div>

<style lang="scss">
  .text {
    flex: auto;
    padding: 20px;
  }

  .loading {
    opacity: 0.5;
    pointer-events: none;
  }
</style>
