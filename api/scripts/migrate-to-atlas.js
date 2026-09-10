/**
 * Copy every collection from one MongoDB into another.
 *   node scripts/migrate-to-atlas.js
 *
 * Source defaults to the project-local dev server (127.0.0.1:27017/hajar) and
 * can be overridden with SOURCE_MONGODB_URI. Target is MONGODB_URI from
 * api/.env — i.e. wherever the app currently points, i.e. Atlas.
 *
 * Documents are upserted by _id, so re-running is safe: nothing duplicates and
 * a half-finished run just resumes. It never deletes, so rows created on the
 * target that do not exist in the source are left alone.
 */
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

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

const redact = (uri) => uri.replace(/:\/\/[^@]*@/, '://***@');

async function main() {
  loadEnv();

  const source =
    process.env.SOURCE_MONGODB_URI ?? 'mongodb://127.0.0.1:27017/hajar';
  const target = process.env.MONGODB_URI;
  if (!target) throw new Error('MONGODB_URI is not set in api/.env');
  if (source === target) throw new Error('Source and target are the same URI');

  console.log(`source: ${redact(source)}`);
  console.log(`target: ${redact(target)}\n`);

  const from = new MongoClient(source, {
    family: 4,
    serverSelectionTimeoutMS: 20000,
  });
  const to = new MongoClient(target, {
    family: 4,
    serverSelectionTimeoutMS: 20000,
  });

  try {
    await Promise.all([from.connect(), to.connect()]);
    const srcDb = from.db();
    const dstDb = to.db();

    for (const { name } of await srcDb.listCollections().toArray()) {
      const docs = await srcDb.collection(name).find({}).toArray();
      if (!docs.length) {
        console.log(`${name}: empty, skipped`);
        continue;
      }
      const result = await dstDb.collection(name).bulkWrite(
        docs.map((doc) => ({
          replaceOne: { filter: { _id: doc._id }, replacement: doc, upsert: true },
        })),
        { ordered: false },
      );
      console.log(
        `${name}: ${docs.length} read, ` +
          `${result.upsertedCount} inserted, ${result.modifiedCount} updated`,
      );

      // Indexes carry the uniqueness rules the app relies on (slug, email).
      for (const index of await srcDb.collection(name).indexes()) {
        if (index.name === '_id_') continue;
        const { key, name: indexName, v, ...options } = index;
        try {
          await dstDb.collection(name).createIndex(key, { name: indexName, ...options });
        } catch (err) {
          console.log(`  index ${indexName}: ${err.message}`);
        }
      }
    }
    console.log('\nDone.');
  } finally {
    await Promise.all([from.close(), to.close()]);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
