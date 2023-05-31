<script lang="ts">
  import { apiKey, tokenBudget } from '$lib/store'

  function setApiKey() {
    // TODO use dialog modal
    const key = prompt('Enter your API key')
    if (key) apiKey.set(key)
  }

  $: hasKey = !!$apiKey

  let costPerKiloToken = 0.002 // cost per 1K tokens in dollars
  $: costInDollars = ($tokenBudget / 1000) * costPerKiloToken
</script>

<div class="fallback">
  <h3 class="h3">
    Welcome to the <a class="anchor" href="https://github.com/tfernd/chatEditor">chatEditor</a>
  </h3>

  <span>Budget: {$tokenBudget.toLocaleString()} tokens (${costInDollars.toFixed(2)})</span>

  <hr class="line !border-t-2" />

  <p>Begin by selecting text in the editor pane. Here are some helpful tips:</p>
  <ul>
    <li>
      Use <strong>Ctrl + Click</strong>
      to select an entire sentence.
    </li>
    <li>
      Use <strong>Alt + Click</strong>
      to select an entire paragraph.
    </li>
  </ul>

  <hr class="line !border-t-2" />

  <p>Use the buttons in this side-bar to enhance your text:</p>
  <ul>
    <li>
      <strong>Rewrite:</strong>
      Improves the readability and fluency of your selected text.
    </li>
    <li>
      <strong>Expand:</strong>
      Adds additional details to your selected text, increasing its length.
    </li>
    <li>
      <strong>Custom:</strong>
      Tailors the text based on the prompt you provide in the "Extra information/Custom prompt" section
      below.
    </li>
  </ul>

  <hr class="line !border-t-2" />

  <p>
    <i>
      The AI-generated variants, showcased in the "Options" stepper below, can be used to replace
      your original text. Select the variant that best suits your needs.
    </i>
  </p>

  <hr class="line !border-t-2" />

  <button type="button" class="btn variant-filled" class:hasKey on:click={setApiKey}>
    Add {hasKey ? 'new' : ''} API key
  </button>
</div>

<style lang="scss">
  .fallback {
    .anchor {
      color: blue;
      font-style: oblique;
      font-weight: 700;
    }
    .line {
      margin-top: 10px;
      height: 10px;
    }

    .hasKey {
      background-color: rgb(71, 118, 1);
    }
  }
</style>
