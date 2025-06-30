import { useIsFetching, useIsMutating } from '@tanstack/react-query'

/**
 * Hook to check if data is loading
 * @returns boolean - true if any query or mutation is running
 */
export const useIsLoading = (): boolean => {
  const isFetching = useIsFetching()
  const isMutating = useIsMutating()

  return isFetching > 0 || isMutating > 0
}

export default useIsLoading
