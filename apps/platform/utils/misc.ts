const convertObjectValuesToString = (
  obj: Record<string, string | boolean | number | undefined>,
) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[key] = `${value}`
    return acc
  }, {} as Record<string, string>)
}

export { convertObjectValuesToString }
