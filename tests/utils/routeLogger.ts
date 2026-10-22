// tests/utils/routeLogger.ts
export const visitedRoutes = new Set<string>();

export function logRoute(url: string) {
  visitedRoutes.add(url);
  getVisitedRoutes();
}

export function getVisitedRoutes() {
  return Array.from(visitedRoutes);
}