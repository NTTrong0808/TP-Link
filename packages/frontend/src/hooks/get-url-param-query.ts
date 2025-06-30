export interface URLParamQueryProps {
  params: Promise<Record<string, string | string[] | any>>
  searchParams: Promise<Record<string, string | string[] | any>>
}

export interface URLParamQueryResult {
  params: Record<string, string | string[] | any>
  query: Record<string, string | string[] | any>
}

export async function getURLParamQuery(props: URLParamQueryProps): Promise<URLParamQueryResult> {
  const params = await props.params
  const query = await props.searchParams

  return {
    params,
    query,
  }
}
