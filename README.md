# chatEditor

chatEditor is a powerful tool for writers. It forces writers to use large languge models LLM correctly. Prompt engerninng i hard. not many people do it. chatEditor come to rescue people who are not that good at prompting or want to improve their writing.

## How to prompt?

LLMs are predictive tools, they predict the next word (token). They do it one at the time. When humans write, we do differently. We can imagine the whole story (as cloudy or clear as we want). So we know what to write, how to steer our text.

LLMs are not capable of thinking ahead like this. So we have to tame them. Make then do our bidding. how?

By providing context.

Examples:
Do not do this:

`Write a book about cyberpunk crime solving`

Instead do this:

`
Improve the text below, add more rich vocabulary and more information:

Synopsis: James was a detective. He lived in a cyberpunk world. He was 30. He was alcoholic. He just needed one case to prove himself. Just one! One day, something happen. (what?)
`

In this way, the LMM will be referencing our work to creating new text, thus properly guiding and stearing the generation process.

chatEditor comes to aid writers doing exactuly this, but in an easier and simpler interface.

Users can select a sentence or paragraph of whole paragraphs and ask the LLM AI easily to rewrite it for them. Or to add more details. Or to use a custom prompt (think of adding details to the instruction).

Users can also ask the AI to judge their text. To find flaws, areas to improve.

## How to use?

Close this repo, use node-js to create a server.

## TO-DO list

- [ ] Make website for easier people using
- [ ] Add options for using different models
- [ ] Improve CSS. Make UI prettier.
- [ ] Fix stepper (finished step)
- [ ] Add streaming to chatGPT, so users get a better feedback
- [ ] Fix context. Sometimes chatGPT get confused and tries to use the context when rewriting. We dont want it to rewrite the context but just to referer to it. how to fix this?
- [ ] Add a overlay to the textarea, so the user can see the selected text all the time

<!-- The text below is from the UI, it is to help write a better README.md -->
<div class="fallback">
  <h3 class="h3">
    Welcome to the <b><i>chatEditor</i></b>
  </h3>

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
