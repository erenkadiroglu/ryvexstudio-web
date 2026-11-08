/** Shared view-transition name so a product icon morphs between pages. Safe for client code. */
export function iconTransitionName(id: string): string {
  return `rv-icon-${id}`;
}
