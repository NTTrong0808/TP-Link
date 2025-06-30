import { parseAsString, useQueryState } from 'nuqs'

export const useSearch = (history: 'push' | 'replace' = 'replace', defaultValue: string = '') => {
  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withDefault(defaultValue).withOptions({
      throttleMs: 300,
      history,
    }),
  )

  return [search, setSearch] as const
}
