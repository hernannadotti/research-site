const sandboxId = process.env.DAYTONA_SANDBOX_ID;
const port = 3000;

if (sandboxId) {
  const publicUrl = `https://${port}-${sandboxId}.proxy.daytona.works`;
  console.log('\n' + '='.repeat(70));
  console.log('🌐 Public URL: ' + publicUrl);
  console.log('='.repeat(70) + '\n');
} else {
  console.log('\n⚠️  Not running in Daytona sandbox - no public URL available\n');
}
