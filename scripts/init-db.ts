import { initDB } from '../src/lib/db';

async function main() {
  console.log('Initializing database...');
  try {
    const result = await initDB();
    console.log('✅ Success:', result.message);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
