/**
 * Starts the project-local MongoDB used for development.
 *   npm run db
 *
 * The server lives in .localdb/ (gitignored) and stores its data in
 * .localdb/data, so nothing is installed system-wide. Stop it with Ctrl-C.
 * Point api/.env at a hosted cluster instead when you go to production.
 */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.join(__dirname, '..');
const LOCALDB = path.join(ROOT, '.localdb');
const DATA = path.join(LOCALDB, 'data');
const EXTRACT = path.join(LOCALDB, 'extract');

function findMongod() {
  if (!fs.existsSync(EXTRACT)) return null;
  for (const dir of fs.readdirSync(EXTRACT)) {
    for (const name of ['mongod.exe', 'mongod']) {
      const candidate = path.join(EXTRACT, dir, 'bin', name);
      if (fs.existsSync(candidate)) return candidate;
    }
  }
  return null;
}

const mongod = findMongod();

if (!mongod) {
  console.error(
    [
      'No local MongoDB found in .localdb/extract.',
      '',
      'Either download a portable build there, or point MONGODB_URI in',
      'api/.env at a hosted cluster (MongoDB Atlas has a free tier).',
    ].join('\n'),
  );
  process.exit(1);
}

fs.mkdirSync(DATA, { recursive: true });

console.log(`Starting MongoDB on 127.0.0.1:27017`);
console.log(`  binary: ${path.relative(ROOT, mongod)}`);
console.log(`  data:   ${path.relative(ROOT, DATA)}`);
console.log('Press Ctrl-C to stop.\n');

const child = spawn(
  mongod,
  ['--dbpath', DATA, '--port', '27017', '--bind_ip', '127.0.0.1'],
  { stdio: 'inherit' },
);

child.on('exit', (code) => process.exit(code ?? 0));
process.on('SIGINT', () => child.kill('SIGINT'));
