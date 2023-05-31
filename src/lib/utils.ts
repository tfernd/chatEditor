export type Selection = { start: number; end: number } | null

// Split the text into paragraphs based on new line character
export const splitTextIntoParagraphs = (text: string): string[] => {
  const paragraphSplittingRule = /(\n)/

  return text.split(paragraphSplittingRule).filter(Boolean)
}

// Split the paragraphs into sentences based on punctuation marks
export const splitParagraphsIntoSentences = (paragraphs: string[]): string[] => {
  const sentenceSplittingRule = /(?<=[.?!:]\s)/

  return paragraphs.flatMap((paragraph) => paragraph.split(sentenceSplittingRule).filter(Boolean))
}

// Find the start and end boundaries of an element (sentence/paragraph) containing the selection.
export const findBoundary = (elements: string[], selectionStart: number): [number, number] => {
  const sizes = elements.map((e) => e.length)
  const startIndex = sizes.reduce((acc, size) => [...acc, acc[acc.length - 1] + size], [0])
  const endIndex = startIndex.map((s, i) => s + sizes[i])

  const i = startIndex.filter((s) => s <= selectionStart).length - 1

  return [startIndex[i], endIndex[i]]
}

// Finds the boundaries of the selected text within the provided HTML textarea element based on different selection rules.
export const getSelectedTextBounds = (event: MouseEvent): Selection => {
  const { ctrlKey, altKey } = event

  const el = event.target as HTMLTextAreaElement
  let { selectionStart, selectionEnd } = el
  let isSame = selectionStart === selectionEnd

  const text: string = el.value
  const paragraphs = splitTextIntoParagraphs(text)
  const sentences = splitParagraphsIntoSentences(paragraphs)

  ;[selectionStart, selectionEnd] = ctrlKey
    ? findBoundary(sentences, selectionStart)
    : altKey
    ? findBoundary(paragraphs, selectionStart)
    : [selectionStart, selectionEnd]

  el.setSelectionRange(selectionStart, selectionEnd, 'forward')

  isSame = selectionStart === selectionEnd
  const newSelection: Selection = !isSame ? { start: selectionStart, end: selectionEnd } : null

  const hasText = getSelectedText(text, newSelection).trim().length > 0

  // return newSelection
  return hasText ? newSelection : null
}

// Updates the selection based on the keyboard event. If there is an existing selection, it returns the updated selection with the current selected text. Otherwise, it returns null.
export const updateSelectionOnKeyPress = (event: KeyboardEvent): Selection => {
  const el = event.target as HTMLTextAreaElement

  if (event.key === 'Escape') {
    el.blur()
    return null
  }

  const { selectionStart, selectionEnd } = el

  if (selectionStart !== selectionEnd) return { start: selectionStart, end: selectionEnd }

  return null
}

export const getSelectedText = (text: string, selection: Selection): string => {
  if (selection && selection.start !== selection.end)
    return text.substring(selection.start, selection.end)

  return ''
}

export const replaceSelectedText = (
  text: string,
  selection: Selection,
  newText: string,
): string => {
  if (selection) {
    const beforeSelection = text.slice(0, selection.start)
    const afterSelection = text.slice(selection.end)

    return beforeSelection + newText + afterSelection
  }

  return text
}

// Select previous `contextLength` paragraphs, excluding the selection from the range, starting from some start position and ending at selection.start
export const getContextSelection = (
  text: string,
  selection: Selection,
  contextLength: number,
): string => {
  if (!selection || contextLength <= 0) return ''

  const paragraphs = splitTextIntoParagraphs(text)

  // Find the paragraph index of selection.start
  const paragraphIndex = paragraphs.findIndex(
    (paragraph) =>
      text.indexOf(paragraph) <= selection.start &&
      text.indexOf(paragraph) + paragraph.length > selection.start,
  )

  const contextStartIndex = Math.max(0, paragraphIndex - contextLength)

  const start = text.indexOf(paragraphs[contextStartIndex])
  const end = selection.start

  const contextSelection: Selection = { start, end }
  const contextText = getSelectedText(text, contextSelection)

  return contextText.trim()
}
