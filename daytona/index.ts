import { Daytona } from '@daytonaio/sdk';
import dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// Ensure env vars are loaded even if the script is run from a different CWD.
const scriptDir = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(scriptDir, '../.env'), override: true });

const apiKey = process.env.DAYTONA_API_KEY;
const organizationId = process.env.DAYTONA_ORGANIZATION_ID;

if (!apiKey) {
  throw new Error('Missing `DAYTONA_API_KEY` (check `research-site/.env`).');
}
if (!organizationId) {
  throw new Error('Missing `DAYTONA_ORGANIZATION_ID` (check `research-site/.env`).');
}

async function main() {
  const daytona = new Daytona({ apiKey, organizationId });
  const sandbox = await daytona.create({
    language: 'typescript',
    public: true,
  });

  await sandbox.git.clone('https://github.com/hernannadotti/research-site.git', '/home/daytona/daytona');
  const status = await sandbox.git.status('/home/daytona/daytona');
  console.log(`Branch: ${status.currentBranch}`);
  const url = await sandbox?.getPreviewLink(3000)
  console.log(sandbox.id, "→", url);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});