export function pruneFlakyVariables<T>(
  obj: T,
  extraPropertiesToPrune: string[] = [],
): void {
  const defaultPropertiesToPrune = ['createdAt', 'updatedAt', 'timestamp']
  const propertiesToPrune = [
    ...new Set([...defaultPropertiesToPrune, ...extraPropertiesToPrune]),
  ]

  if (obj === null || obj === undefined) {
    return
  }

  const pruneRecursively = (item: any) => {
    for (const prop of propertiesToPrune) {
      delete item[prop]
    }
    Object.keys(item).forEach((key) => {
      if (item[key] && typeof item[key] === 'object') {
        pruneRecursively(item[key])
      }
    })
  }

  pruneRecursively(obj)
}
