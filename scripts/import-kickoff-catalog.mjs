import { mkdir, writeFile } from 'node:fs/promises';

const collectionUrl = 'https://kickoffvintage.com/collections/new-arrivals/products.json';
const outputPath = new URL('../src/lib/kickoffCatalog.json', import.meta.url);
const homeOutputPath = new URL('../src/lib/kickoffHomeArrivals.json', import.meta.url);
const pageSize = 250;

const decodeDetails = (html = '') => Object.fromEntries(
  [...html.matchAll(/(?:^|>)\s*([A-Z]+)\s*-\s*([^<\n]+)/g)].map(([, key, value]) => [key, value.trim()]),
);

const classifyLeague = (tags, team) => {
  if (tags.some((tag) => /nation/i.test(tag))) return 'National Team';
  if (/^(Argentina|Brazil|England|France|Germany|Italy|Netherlands|Portugal|Spain|Nigeria|Belgium|Croatia|Japan|Mexico|Scotland|Turkey|USA)$/i.test(team)) return 'National Team';
  return 'Vintage Football';
};

const products = [];
for (let page = 1; ; page += 1) {
  const response = await fetch(`${collectionUrl}?limit=${pageSize}&page=${page}`);
  if (!response.ok) throw new Error(`Kickoff Vintage returned ${response.status} on page ${page}.`);
  const { products: pageProducts = [] } = await response.json();
  if (!pageProducts.length) break;

  products.push(...pageProducts.map((product) => {
    const details = decodeDetails(product.body_html);
    const variants = product.variants ?? [];
    const firstVariant = variants[0];
    const sizes = [...new Set(variants.map((variant) => variant.option2).filter(Boolean))];
    const team = details.TEAM || firstVariant?.option1 || 'Vintage Football';
    const images = product.images ?? [];

    return {
      id: `kickoff-${product.id}`,
      name: product.title,
      league: classifyLeague(product.tags ?? [], team),
      team,
      price: Number(firstVariant?.price ?? 0),
      rating: 5,
      reviews_count: 0,
      image_url: images[0]?.src ?? '',
      ...(images[1]?.src ? { hover_image_url: images[1].src } : {}),
      is_new: true,
      sizes: sizes.length ? sizes : [details.SIZE || 'One size'],
      colors: [],
      available: variants.some((variant) => variant.available),
      source_url: `https://kickoffvintage.com/products/${product.handle}`,
    };
  }));

  if (pageProducts.length < pageSize) break;
}

await mkdir(new URL('../src/lib/', import.meta.url), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(products, null, 2)}\n`);
await writeFile(homeOutputPath, `${JSON.stringify(products.slice(0, 5), null, 2)}\n`);
console.log(`Imported ${products.length} Kickoff Vintage products.`);
