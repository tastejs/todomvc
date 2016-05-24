export function willAuthorize() {
  return { type: 'authorizing' }
}

export function didAuthorized(isAuthorized) {
  return { type: 'authorized', isAuthorized: isAuthorized }
}
