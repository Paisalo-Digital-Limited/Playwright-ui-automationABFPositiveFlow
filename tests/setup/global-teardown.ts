import fs from 'fs';
import path from 'path';
import { visitedRoutes } from '../utils/routeLogger';
import { executeCleanupQueries } from '../utils/sqlUtils';

export default async () => {
  try {
    // ==================== ROUTE LOGGING ====================
    const outputDir = path.join(__dirname, '../../test-results');
    const outputPath = path.join(outputDir, 'visitedRoutes.txt');
    const whitelistPath = path.join(__dirname, '../utils/knownRoutes.json');

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const routesArray = Array.from(visitedRoutes);

    fs.writeFileSync(
      outputPath,
      routesArray.join('\n'),
      'utf-8'
    );

    console.log('✅ Visited routes logged at:', outputPath);

    if (fs.existsSync(whitelistPath)) {
      const knownRoutes = JSON.parse(
        fs.readFileSync(whitelistPath, 'utf-8')
      );

      const unexpectedRoutes = routesArray.filter(
        route => !knownRoutes.includes(route)
      );

      if (unexpectedRoutes.length > 0) {
        console.warn('\n⚠️ New or untracked routes visited:');

        unexpectedRoutes.forEach(route =>
          console.warn(` - ${route}`)
        );
      } else {
        console.log(
          '\n✅ All visited routes matched knownRoutes.json'
        );
      }
    }
  } catch (error) {
    console.error(
      '❌ Route logging failed:',
      error
    );
  }

  // ==================== DATABASE CLEANUP ====================
  try {
    console.log(
      '\n🧹 Starting database cleanup...'
    );

    await executeCleanupQueries();

    console.log(
      '✅ Database cleanup completed successfully'
    );
  } catch (error) {
    console.error(
      '❌ Database cleanup failed:',
      error
    );
  }
};