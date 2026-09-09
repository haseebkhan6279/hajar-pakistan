/**
 * Reset the dashboard admin password without touching the database by hand.
 *   node scripts/reset-admin.js
 * Reads MONGODB_URI / ADMIN_EMAIL / ADMIN_PASSWORD from api/.env
 */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

async function main() {
  loadEnv();
  const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Missing MONGODB_URI / ADMIN_EMAIL / ADMIN_PASSWORD in api/.env');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI, { family: 4 });
  const users = mongoose.connection.collection('users');
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await users.updateOne(
    { email: ADMIN_EMAIL.toLowerCase() },
    {
      $set: {
        email: ADMIN_EMAIL.toLowerCase(),
        passwordHash,
        role: 'admin',
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true },
  );
  console.log(`Admin password reset for ${ADMIN_EMAIL}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
