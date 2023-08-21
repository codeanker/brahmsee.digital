export default function _import<T>(file: string): () => Promise<T> {
  return () => import(/* @vite-ignore */ file)
}
