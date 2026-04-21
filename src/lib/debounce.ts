export function debounce<T extends (...args: never[]) => void>(fn: T, wait: number): T {
  let timeout: ReturnType<typeof setTimeout> | undefined
  return ((...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), wait)
  }) as T
}
