export const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  const message = error instanceof Error ? error.message : fallbackMessage
  return message || fallbackMessage
}
