
import { test } from '@playwright/test';
import { executeCleanupQueries } from '../../../utils/sqlUtils';

// test('Run PostgreSQL cleanup only', async () => {
//     try {
//         console.log('Executing database cleanup...');
//         await executeCleanupQueries();
//         console.log('Cleanup completed');
//     } catch (error) {
//         console.error('Cleanup failed:', error);
//         throw error;
//     }
// });
