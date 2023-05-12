export function load({ params }) {

  return {
    currentFilter: params.filter ?? 'all',
  };
}
