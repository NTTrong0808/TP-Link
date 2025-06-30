import { useQueryState } from 'nuqs'

export const useSearch = () => {
  const [search, setSearch] = useQueryState('search', {
    history: 'replace',
  })

  return [search, setSearch] as const
}
