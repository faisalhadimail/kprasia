// Shared cache invalidation flag for seed-data
// All mutation API routes should call invalidateCache() after successful writes

let cacheDirty = false

export function invalidateCache() {
  cacheDirty = true
}

export function isCacheDirty(): boolean {
  return cacheDirty
}

export function clearDirtyFlag() {
  cacheDirty = false
}
