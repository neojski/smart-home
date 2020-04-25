export async function getJSONData(url: string) {
  // around 2019-12-11 tfl started sending stale responses so we add this ugly cache busting URL param
  const response = await fetch(url + ("&cache" + Date.now()));
  if (response.status === 200) {
    return await response.json();
  } else {
    throw new Error("Unexpected exit code" + response.statusText);
  }
}
