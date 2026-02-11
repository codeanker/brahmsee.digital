import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges CSS class names intelligently using clsx and tailwind-merge.
 * This function combines class names and resolves Tailwind CSS conflicts,
 * ensuring the last class wins when there are duplicates.
 * @param inputs - Class names, objects, or arrays of classes to merge
 * @returns A merged string of class names
 * @example
 * cn('px-4 py-2', 'bg-blue-500') // 'px-4 py-2 bg-blue-500'
 * cn('px-4', 'px-8') // 'px-8' (last one wins)
 * cn({ 'text-red-500': true, 'hidden': false }) // 'text-red-500'
 */
export default function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
