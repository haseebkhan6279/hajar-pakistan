/**
 * Copy every hot-linked Instagram tile into the storefront's own /public.
 *   node scripts/mirror-instagram.js            # download + repoint the rows
 *   node scripts/mirror-instagram.js --dry-run  # download only, leave the DB
 *
 * The importer keeps Instagram's CDN URL when Cloudinary is not configured,
 * and those URLs are signed and expire after a few weeks — the tile then
 * renders as its alt text. This asks oEmbed for a fresh thumbnail by the
 * post's permalink, writes it to web/public/instagram/<id>.jpg and sets the
 * row's image to that path. The files ship with the next web deploy, so
 * deploy web straight after running this.
 *
 * Rows already on Cloudinary or a local path are left alone.
 */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const OEMBED = 'https://www.instagram.com/api/v1/oembed/';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const OUT_DIR = path.join(__dirname, '..', '..', 'web', 'public', 'instagram');
const HOTLINK = /(fbcdn\.net|cdninstagram\.com)\//;

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

async function freshThumbnail(postUrl) {
  const res = await fetch(
    `${OEMBED}?url=${encodeURIComponent(postUrl)}&omitscript=true`,
    {
      headers: { 'User-Agent': UA, Accept: 'application/json' },
      signal: AbortSignal.timeout(15_000),
    },
  );
  if (!res.ok) throw new Error(`oEmbed responded ${res.status}`);
  const data = await res.json();
  if (!data.thumbnail_url) throw new Error('oEmbed returned no thumbnail');
  return data.thumbnail_url;
}

async function download(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`image responded ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  loadEnv();
  const dryRun = process.argv.includes('--dry-run');
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set');

  await mongoose.connect(process.env.MONGODB_URI);
  const posts = mongoose.connection.collection('instagramposts');
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const rows = await posts.find({}).toArray();
  let done = 0;
  let failed = 0;

  for (const row of rows) {
    const id = String(row._id);
    if (!HOTLINK.test(row.image ?? '')) continue;
    if (!row.postUrl) {
      console.warn(`skip ${id}: no post link — upload its image by hand`);
      failed++;
      continue;
    }

    try {
      // The stored URL may still be live; otherwise ask for a fresh one
      let buffer;
      try {
        buffer = await download(row.image);
      } catch {
        buffer = await download(await freshThumbnail(row.postUrl));
      }

      const file = `${id}.jpg`;
      fs.writeFileSync(path.join(OUT_DIR, file), buffer);
      if (!dryRun) {
        await posts.updateOne(
          { _id: row._id },
          { $set: { image: `/instagram/${file}` } },
        );
      }
      console.log(`ok   ${id}  ${row.postUrl}`);
      done++;
    } catch (err) {
      console.warn(`fail ${id}  ${row.postUrl}: ${err.message}`);
      failed++;
    }
  }

  console.log(
    `\n${done} mirrored${dryRun ? ' (dry run, DB untouched)' : ''}, ${failed} failed`,
  );
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
