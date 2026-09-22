// src/api.js
const cache = {};

export async function searchDrugs(query, signal) {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  if (cache[cleanQuery]) {
    return cache[cleanQuery];
  }

  // Exact openfda brand_name search as specified in the assignment
  const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(cleanQuery)}"&limit=20`;

  try {
    const res = await fetch(url, { signal });

    // OpenFDA returns 404 when query has 0 results
    if (res.status === 404) {
      cache[cleanQuery] = [];
      return [];
    }

    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }

    const data = await res.json();
    const list = data.results || [];
    cache[cleanQuery] = list;
    return list;
  } catch (err) {
    if (err.name === 'AbortError') {
      return null; // Don't throw on abort
    }
    throw err;
  }
}

export async function getDrugById(id, signal) {
  if (!id) return null;
  const cacheKey = `id_${id}`;
  if (cache[cacheKey]) return cache[cacheKey];

  const url = `https://api.fda.gov/drug/label.json?search=id:"${encodeURIComponent(id)}"&limit=1`;
  try {
    const res = await fetch(url, { signal });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Could not load details");

    const data = await res.json();
    const item = data.results?.[0] || null;
    if (item) cache[cacheKey] = item;
    return item;
  } catch (err) {
    if (err.name === 'AbortError') return null;
    throw err;
  }
}
