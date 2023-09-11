export function any<T>(list: T[], condition: (e: T) => boolean): boolean {
  for (let element of list) if (condition(element)) return true;

  return false;
}
