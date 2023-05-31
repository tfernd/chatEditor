<script lang="ts">
  import { Stepper, Step } from '@skeletonlabs/skeleton'

  import Fallback from './Fallback.svelte'
  import Textarea from './Textarea.svelte'

  import { rawText, selection, output } from '$lib/store'
  import {
    getSelectedText,
    getContextSelection,
    splitTextIntoParagraphs,
    replaceSelectedText,
  } from '$lib/utils'
  import { chatGPT } from '$lib/chatGPT'
  import type { Message } from '$lib/chatGPT'

  let info: string = ''
  let contextLength: number = 0
  let step = 0

  let modal: HTMLDialogElement

  export let loading = false
  let dump = ''
  let judge = ''
  async function generateVariants(mode: 'rewrite' | 'expand' | 'custom' | 'judge') {
    const selectedText = getSelectedText($rawText, $selection)
    const contextText = getContextSelection($rawText, $selection, contextLength)

    if (!selectedText) return

    let instruction = ''
    switch (mode) {
      case 'rewrite':
        instruction = `* Carefully change the <text> to make it more clear, more logical, grammatically correct, and easier to read.`
        break
      case 'expand':
        instruction = `* Enrich the <text> with more details to paint a vivid picture in the reader's mind. Use your creativity to add just the right amount of information without altering the core message. Focus on providing additional insights and descriptive elements to enhance the content.`
        break
      case 'custom':
        if (!info) return
        instruction = `* Please follow these instructions when rewriting the <text>: ${info}`
        break
    }
    if (contextText)
      instruction += `\n* To better comprehend the narrative, consider the following background <context> details. Let these insights serve as a framework for your revisions and additions, seamlessly blending them with the existing storyline. While the <context> should remain untouched, it will provide a solid foundation for your creative work. Focus your revisions and additions on the provided text only. Do not modify the context given.`
    instruction = `<instruction>\n${instruction}\n</instruction>`

    let system = `Act as a professional editor, enhancing and rewriting user's <text> for improved quality. Return the edited text within <revised> tags using XML format. Only use this tag for output!`

    let content = ''
    if (info && mode !== 'custom') content += `<details>${info}</details>\n\n`
    if (contextText) content += `<context>${contextText}</context>\n\n`
    content += `<text>${selectedText}</text>`

    let user = `${instruction}\n\n${content}`

    if (mode === 'judge') {
      system = `Act in the capacity of an accomplished editor, applying a discerning eye and expert judgment.`
      user =
        'Leveraging your expertise as a seasoned editor, critically evaluate the following text. Assess its quality in terms of clarity, coherence, grammatical correctness, and style. Identify any areas that need improvement or revision. Provide insightful and constructive feedback.\n\n'
      user += `<text>${selectedText}</text>`
    }

    const messages: Message[] = [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ]

    dump = `System: ${system}\n\nUser:\n${user}`

    loading = true
    const response = await chatGPT(messages)
    loading = false
    if (!response) return

    if (mode === 'judge') {
      judge = response.choices[0].message.content

      if (judge) modal.showModal()
      return
    }

    let newMessage = response.choices[0].message.content
      .match(/<(text|revised|p)>(.+?)<\/\1>/s)?.[2]
      ?.trim()
    if (!newMessage) return

    $output = [...$output, newMessage]
    step = $output.length - 1
  }

  function chooseOption() {
    const newText = $output[step]

    $rawText = replaceSelectedText($rawText, $selection, newText)
    $output = [] // reset
    $selection = null
  }
</script>

<div class="side-bar" class:loading>
  <dialog class="modal" bind:this={modal}>
    <div class="modal-contaner">
      <Textarea value={judge} />

      <form method="dialog">
        <button
          type="button"
          class="btn btn-sm variant-filled"
          on:click|preventDefault={() => modal.close()}>
          OK
        </button>
      </form>
    </div>
  </dialog>

  {#if loading}
    <div class="wait-loading">
      <span>Waiting for chatGPT response...</span>
      <div class="message">
        <Textarea bind:value={dump} fontSize="0.8rem" />
      </div>
    </div>
  {:else if $selection !== null}
    <div class="btn-group variant-ghost">
      <button on:click|preventDefault={async () => await generateVariants('rewrite')}>
        Rewrite
      </button>
      <button on:click|preventDefault={async () => await generateVariants('expand')}>Expand</button>
      {#if info.trim()}
        <button on:click|preventDefault={async () => await generateVariants('custom')}>
          Custom
        </button>
      {/if}
      <button class="judge" on:click|preventDefault={async () => await generateVariants('judge')}>
        Judge
      </button>
    </div>

    <div class="selection">
      {#each splitTextIntoParagraphs(getSelectedText($rawText, $selection)) as paragraphs}
        <p>{paragraphs}</p>
      {/each}
    </div>

    <div class="context">
      <span>{contextLength}</span>
      <input type="range" bind:value={contextLength} max={10} />
    </div>

    <div class="info">
      <Textarea
        placeholder="Extra information/custom prompt."
        bind:value={info}
        fontSize="0.9rem" />
    </div>

    <div class="stepper">
      <Stepper
        start={step}
        stepTerm="Option"
        buttonCompleteLabel="Nothing"
        on:next={() => (step = step + 1)}
        on:back={() => (step = step - 1)}
        on:complete={() => {}}>
        {#each $output as out}
          <Step>
            <svelte:fragment slot="header">{''}</svelte:fragment>
            <div class="output">
              {#each splitTextIntoParagraphs(out) as paragraphs}
                <p>{paragraphs}</p>
              {/each}
            </div>
          </Step>
        {/each}
      </Stepper>
    </div>

    {#if $output.length > 0}
      <span class="choose">
        <button
          type="button"
          class="btn btn-sm variant-filled-success"
          on:click|preventDefault={chooseOption}>
          Choose
        </button>
      </span>
    {/if}
  {:else}
    <Fallback />
  {/if}
</div>

<style lang="scss">
  .side-bar {
    width: 400px;
    border-radius: 8px;
    background-color: rgb(182, 182, 182);
    text-align: center;
    padding: 10px 15px;
    margin: 20px;
    margin-left: 0;
    user-select: none;

    &.loading {
      opacity: 0.5;
    }

    .modal {
      .modal-contaner {
        display: flex;
        flex-direction: column;
        width: 800px;
        height: 500px;

        form {
          padding-top: 10px;
        }
      }
    }

    .wait-loading {
      display: flex;
      flex-direction: column;
      height: 100%;

      span {
        color: red;
        margin-top: 10px;
        font-size: 1.3rem;
      }

      .message {
        height: 100%;
        padding: 10px;
      }
    }

    .judge {
      background-color: rgba(241, 223, 67, 0.597);
    }

    .selection,
    .output {
      margin-top: 10px;
      max-height: 150px;
      text-align: justify;
      overflow-y: scroll;
      background-color: rgb(206, 206, 206);
      border-radius: 8px;
      padding: 8px;

      p {
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto;
        font-size: 0.8rem;
        line-height: 1.2;
        word-wrap: break-word;

        &:not(:last-child) {
          padding-bottom: 0.2rem;
        }
      }
    }

    .context {
      padding: 10px 0;
      display: flex;
      gap: 15px;
    }

    .info {
      margin-top: 10px;
      font-size: 0.8rem;
    }

    .output {
      background-color: #fcffec;
      font-size: 0.9rem;
      max-height: 150px;
    }

    .choose button {
      margin-top: 15px;
    }
  }
</style>
