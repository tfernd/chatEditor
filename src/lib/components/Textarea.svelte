<script lang="ts">
  import wordsCounter from 'word-counting'

  export let value: string = ''
  export let placeholder: string = ''
  export let fontSize: string = '1rem'
  export let showWordCount: boolean = false

  let textarea: HTMLTextAreaElement
  let counter: HTMLElement

  // TODO add overlay to textarea
  $: words = wordsCounter(value).wordsCount
  $: {
    if (textarea && counter) {
      const pos = textarea.getBoundingClientRect()
      const myPos = counter.getBoundingClientRect()

      counter.style.top = `${pos.height - 12}px`
      counter.style.left = `${pos.right - myPos.width}px`
    }
  }
</script>

<div class="container">
  <textarea
    bind:this={textarea}
    {placeholder}
    bind:value
    on:mouseup
    on:keyup
    style={`font-size: ${fontSize}`} />

  {#if showWordCount}
    <span bind:this={counter} class="counter">{words} Words</span>
  {/if}
</div>

<style lang="scss">
  .container {
    width: 100%;
    height: 100%;

    textarea {
      font-family: 'Montserrat', sans-serif;
      width: 100%;
      height: 100%;
      resize: none;
      border-radius: 8px;
      line-height: 1.4;
      border: none;
      outline: none;
      transition: 0.2s;
      color: #333;
      padding: 8px;
    }

    .counter {
      user-select: none;
      position: absolute;
      background-color: rgba(0, 0, 0, 0.1);
      padding: 4px;
      font-size: 0.9rem;
      border-bottom-right-radius: 8px;
      border-top-left-radius: 8px;
    }
  }
</style>
