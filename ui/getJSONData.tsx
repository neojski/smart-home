export async function getJSONData(url: string) {
  // around 2019-12-11 tfl started sending stale responses so we add this ugly cache busting URL param
  const response = await fetch(url + ("&cache" + Date.now()));
  return await response.json();
}
