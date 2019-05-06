
export interface ObjectMap<T> {
  [key: string]: T;
}

export function mapValues<T1, T2>(object: ObjectMap<T1>, fn: (item: T1) => T2): ObjectMap<T2> {
  return Object.assign(
    {}, ...Object.keys(object).map(
      k => ({[k]: fn(object[k] as any)})
    )
  );
}
