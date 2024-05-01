export type ART<T extends (...args: any) => any> = Awaited<ReturnType<T>>
