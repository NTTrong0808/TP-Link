export async function runTasksWithConcurrency<T>(tasks: (() => Promise<T>)[], concurrency: number): Promise<T[]> {
  const results: T[] = []
  let index = 0

  async function runner() {
    while (index < tasks.length) {
      const currentIndex = index++
      try {
        const result = await tasks[currentIndex]()
        results[currentIndex] = result
      } catch (e) {}
    }
  }

  // Khởi chạy đồng thời tối đa `concurrency` runners
  const runners = Array(concurrency)
    .fill(0)
    .map(() => runner())
  await Promise.all(runners)

  return results
}
