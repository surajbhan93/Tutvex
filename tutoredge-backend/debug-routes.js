/**
 * Debug script to check all registered routes
 * Run with: node debug-routes.js
 */

const buildApp = require('./dist/app').default;

async function debugRoutes() {
  console.log('🔍 Checking all registered routes...\n');
  
  try {
    const app = await buildApp();
    await app.ready();

    const routes = [];
    
    // Get all routes
    app.routes.forEach((route) => {
      routes.push({
        method: route.method,
        url: route.url,
        path: route.path || route.url
      });
    });

    // Sort routes by URL
    routes.sort((a, b) => a.url.localeCompare(b.url));

    console.log(`✅ Total routes registered: ${routes.length}\n`);

    // Group by prefix
    const leadRoutes = routes.filter(r => r.url.includes('/leads'));
    const tutorRoutes = routes.filter(r => r.url.includes('/tutor'));
    const adminRoutes = routes.filter(r => r.url.includes('/admin'));

    console.log('📋 LEAD ROUTES:');
    leadRoutes.forEach(r => {
      console.log(`  ${r.method.padEnd(7)} ${r.url}`);
    });

    console.log('\n📋 TUTOR ROUTES:');
    tutorRoutes.forEach(r => {
      console.log(`  ${r.method.padEnd(7)} ${r.url}`);
    });

    console.log('\n📋 ADMIN ROUTES:');
    adminRoutes.forEach(r => {
      console.log(`  ${r.method.padEnd(7)} ${r.url}`);
    });

    console.log('\n📋 ALL ROUTES:');
    routes.forEach(r => {
      console.log(`  ${r.method.padEnd(7)} ${r.url}`);
    });

    await app.close();
    console.log('\n✅ Route check completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking routes:', error);
    process.exit(1);
  }
}

debugRoutes();
