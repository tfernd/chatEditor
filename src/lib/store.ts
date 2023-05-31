import { writable, type Writable } from 'svelte/store'

import type { Selection } from './utils'

export function storable<T>(key: string, init: T): Writable<T> {
  const { subscribe, set, update } = writable(init)

  const isBrowser = typeof window !== 'undefined'

  if (isBrowser) {
    const storedData = localStorage.getItem(key)

    if (storedData) set(JSON.parse(storedData) as T)
  }

  return {
    subscribe,
    set: (data) => {
      if (isBrowser) localStorage.setItem(key, JSON.stringify(data))
      set(data)
    },
    update: (callback) => {
      update((data) => {
        const newData = callback(data)

        if (isBrowser) localStorage.setItem(key, JSON.stringify(newData))

        return newData
      })
    },
  }
}

// localStorage store
export const apiKey = storable<string>('apiKey', '')
export const tokenBudget = storable<number>('tokenBudget', 0)
export const rawText = storable<string>('rawText', '')

// normal store
export const selection = writable<Selection>(null)
export const output = writable<string[]>([])
