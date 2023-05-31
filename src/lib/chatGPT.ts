import { get } from 'svelte/store'

import { apiKey, tokenBudget } from './store'

export type Message = {
  role: 'system' | 'user' | 'assistant'
  content: string
  name?: string
}

export type Model = 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-32k'

export type ChatGPTResponse = {
  id: string
  object: string
  created: number
  model: string
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  choices: [
    {
      index: number
      message: {
        role: string
        content: string
      }
      finish_reason: 'stop' | 'length' | 'content_filter' | null
    },
  ]
}

export async function chatGPT(
  messages: Message[],
  model: Model = 'gpt-3.5-turbo',
  temperature = 1,
  top_p = 1,
  max_tokens = Infinity,
): Promise<ChatGPTResponse | null> {
  const url = 'https://api.openai.com/v1/chat/completions'
  const headers = {
    Authorization: `Bearer ${get(apiKey)}`,
    'Content-Type': 'application/json',
  }

  const data = {
    model,
    messages,
    temperature,
    top_p,
    n: 1,
    stream: false, // TODO implement
    max_tokens,
  }

  const css = 'background-color: #f0f0f0; color: #333; padding: 4px; font-weight: bold;'
  console.log(`%cchatGPT Payload:`, `${css} font-size: 18px;`)
  messages.forEach(({ role, content }) => console.log(`%c${role}: %c${content}`, css, ''))

  try {
    const startTime = new Date().getTime()

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })

    const endTime = new Date().getTime()
    const requestTime = endTime - startTime

    console.log(`%cRequest time: ${requestTime}ms`, 'color: blue; font-weight: bold;')

    const chatGPTResponse = (await response.json()) as ChatGPTResponse
    const { usage } = chatGPTResponse

    tokenBudget.update((tokens) => tokens + usage.total_tokens)

    chatGPTResponse.choices.forEach((c) =>
      console.log(`%cMessage Content:`, css, c.message.content),
    )

    return chatGPTResponse
  } catch (error) {
    console.error(error)

    return null
  }
}
