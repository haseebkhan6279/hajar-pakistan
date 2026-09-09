/**
 * Push the brand copy in src/common/brand.ts onto the collection rows already
 * in the database.
 *   node scripts/sync-collections.js
 *
 * The boot seeder writes those defaults with $setOnInsert, so a collection
 * created on an earlier boot keeps whatever tagline it was born with — that is
 * deliberate, it means a rename in the dashboard survives a restart. When the
 * house copy itself changes, run this once to catch the existing rows up.
 *
 * It writes name, tagline, parentSlug and sortOrder only. Cover images, product
 * filing and everything else are left alone, and unlike `seed:catalog` it does
 * not touch products at all.
 */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

function loadEnv() {
  const file = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let value = m[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[m[1]]) process.env[m[1]] = value;
  }
}

/**
 * Read the defaults out of the TypeScript source rather than keeping a second
 * copy here — brand.ts is plain data, so the object literals parse straight
 * out of it and the two can never drift.
 */
function defaultCategories() {
  const src = fs.readFileSync(
    path.join(__dirname, '..', 'src', 'common', 'brand.ts'),
    'utf8',
  );
  const block = src.match(
    /export const DEFAULT_CATEGORIES = \[([\s\S]*?)\n\] as const;/,
  );
  if (!block) throw new Error('DEFAULT_CATEGORIES not found in brand.ts');

  return [...block[1].matchAll(/\{([\s\S]*?)\}/g)].map((entry) => {
    // Every field in the literal is either a single-quoted string or a number
    const text = entry[1];
    const strings = {};
    for (const m of text.matchAll(/(\w+):\s*'([^']*)'/g)) strings[m[1]] = m[2];
    const order = text.match(/sortOrder:\s*(\d+)/);
    return {
      name: strings.name ?? '',
      slug: strings.slug ?? '',
      tagline: strings.tagline ?? '',
      parentSlug: strings.parentSlug ?? '',
      sortOrder: order ? Number(order[1]) : 0,
    };
  });
}

async function main() {
  loadEnv();
  const { MONGODB_URI } = process.env;
  if (!MONGODB_URI) {
    console.error('Missing MONGODB_URI in api/.env');
    process.exit(1);
  }

  const wanted = defaultCategories();
  // Never write a half-parsed row over live copy
  const bad = wanted.filter((c) => !c.slug || !c.name || !c.tagline);
  if (!wanted.length || bad.length) {
    console.error(
      'brand.ts did not parse cleanly — nothing written. Check DEFAULT_CATEGORIES.',
    );
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI, { family: 4 });
  const categories = mongoose.connection.collection('categories');

  let changed = 0;
  for (const c of wanted) {
    const before = await categories.findOne({ slug: c.slug });
    /*
      Diff the four fields this script owns, rather than trusting
      modifiedCount — the $set always bumps updatedAt, so Mongo reports a
      modification even when none of the copy moved.
    */
    const moved = before
      ? Object.keys(c).filter((k) => before[k] !== c[k])
      : [];

    if (before && moved.length === 0) {
      console.log('  unchanged ' + c.name);
      continue;
    }

    await categories.updateOne(
      { slug: c.slug },
      {
        $set: { ...c, updatedAt: new Date() },
        $setOnInsert: { image: '', createdAt: new Date() },
      },
      { upsert: true },
    );
    changed += 1;

    if (!before) {
      console.log('  created   ' + c.name + '  “' + c.tagline + '”');
      continue;
    }
    console.log('  updated   ' + c.name);
    for (const key of moved) {
      console.log(
        '              ' + key + ': ' + (before[key] || '—') + '  →  ' + c[key],
      );
    }
  }

  console.log(
    '\n' + changed + ' of ' + wanted.length + ' collections written.',
  );
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
