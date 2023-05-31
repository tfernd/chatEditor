<script lang="ts">
  import { Text, Sidebar } from '$lib/components'

  let loading: boolean = false
</script>

<div class="app">
  <Text {loading} />
  <Sidebar bind:loading />
</div>

<link
  href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&display=swap"
  rel="stylesheet" />

<style lang="scss">
  .app {
    display: flex;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
</style>
