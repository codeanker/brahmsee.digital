/* eslint-disable @typescript-eslint/no-unused-expressions */
/**
 * Options for configuring the debounce behavior.
 * @template Result - The return type of the debounced function
 */
export type Options<Result> = {
  /** If true, the function is invoked immediately on the first call */
  isImmediate?: boolean
  /** Maximum time in milliseconds the function can be delayed before being invoked */
  maxWait?: number
  /** Optional callback to execute when the function is invoked */
  callback?: (data: Result) => void
}

/**
 * A debounced function with a cancel method.
 * @template Args - The argument types of the function
 * @template F - The function type
 */
export interface DebouncedFunction<Args extends any[], F extends (...args: Args) => any> {
  (this: ThisParameterType<F>, ...args: Args & Parameters<F>): Promise<ReturnType<F>>
  /** Cancels any pending invocations */
  cancel: (reason?: any) => void
}

interface DebouncedPromise<FunctionReturn> {
  resolve: (result: FunctionReturn) => void
  reject: (reason?: any) => void
}

/**
 * Creates a debounced version of a function that delays its execution until after
 * a specified wait time has elapsed since the last time it was invoked.
 * 
 * This is useful for performance optimization, such as limiting the rate of expensive
 * operations like API calls or DOM updates in response to user input.
 * @template Args - The argument types of the function
 * @template F - The function type
 * @param func - The function to debounce
 * @param waitMilliseconds - The number of milliseconds to delay (default: 50)
 * @param options - Additional options for debounce behavior
 * @returns A debounced version of the function that returns a Promise
 * @example
 * const debouncedSearch = debounce((query: string) => {
 *   return apiClient.search(query)
 * }, 300)
 * 
 * // This will only execute once after 300ms of no calls
 * debouncedSearch('test')
 * debouncedSearch('test2')
 * debouncedSearch('test3')
 */
export function debounce<Args extends any[], F extends (...args: Args) => any>(
  func: F,
  waitMilliseconds = 50,
  options: Options<ReturnType<F>> = {}
): DebouncedFunction<Args, F> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  const isImmediate = options.isImmediate ?? false
  const callback = options.callback ?? false
  const maxWait = options.maxWait
  let lastInvokeTime = Date.now()

  let promises: DebouncedPromise<ReturnType<F>>[] = []

  function nextInvokeTimeout() {
    if (maxWait !== undefined) {
      const timeSinceLastInvocation = Date.now() - lastInvokeTime

      if (timeSinceLastInvocation + waitMilliseconds >= maxWait) {
        return maxWait - timeSinceLastInvocation
      }
    }

    return waitMilliseconds
  }

  const debouncedFunction = function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this
    return new Promise<ReturnType<F>>((resolve, reject) => {
      const invokeFunction = function () {
        timeoutId = undefined
        lastInvokeTime = Date.now()
        if (!isImmediate) {
          const result = func.apply(context, args)

          callback && callback(result)
          promises.forEach(({ resolve }) => resolve(result))
          promises = []
        }
      }

      const shouldCallNow = isImmediate && timeoutId === undefined

      if (timeoutId !== undefined) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(invokeFunction, nextInvokeTimeout())

      if (shouldCallNow) {
        const result = func.apply(context, args)

        callback && callback(result)
        return resolve(result)
      }
      promises.push({ resolve, reject })
    })
  }

  debouncedFunction.cancel = function (reason?: any) {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
    }
    promises.forEach(({ reject }) => reject(reason))
    promises = []
  }

  return debouncedFunction
}
