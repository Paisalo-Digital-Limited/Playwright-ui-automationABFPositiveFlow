// import sql from 'mssql';

// export const config: sql.config = {
//   user: 'AutomationUsers',
//   password: 'AutomationUsers@123!',
//   server: '192.168.1.55',
//   database: 'PDLERP_UAT',
//   options: {
//     encrypt: false,
//     trustServerCertificate: true,
//   },
// };

// export async function executeCleanupQueries() {
//   let pool: sql.ConnectionPool | undefined;

//   try {
//     pool = await sql.connect(config);

//     console.log('Connected to SQL Server');

//     await pool.request().query(`
//       UPDATE OemBrandDetails
//       SET
//         IsDeleted = 1,
//         IsActive = 0,
//         ModifiedBy = NULL,
//         ModifiedOn = GETDATE()
//       WHERE Firm_Name = 'InfoComm LLP'
//         AND IsActive = 1;
//     `);

//     console.log('OemBrandDetails cleanup completed');

//     await pool.request().query(`
//       UPDATE DealerDetails
//       SET
//         IsDeleted = 1,
//         IsActive = 0,
//         ModifiedBy = NULL,
//         ModifiedOn = GETDATE()
//       WHERE Firm_Name = 'Himanshu'
//         AND IsActive = 1;
//     `);

//     console.log('DealerDetails cleanup completed');

//   } catch (error) {
//     console.error('Cleanup query failed:', error);
//   } finally {
//     await pool?.close();
//   }
// }





import { Pool, PoolClient } from 'pg';

const pool = new Pool({
  host: process.env.PGHOST || '34.131.181.133',
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE || 'pdlerp_uat',
  user: process.env.PGUSER || 'paisalo_developer',
  password: process.env.PGPASSWORD,
  ssl: {
    // Temporary workaround only. Prefer a trusted database CA certificate.
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 15000,
});

// Converts a value to the correct SQL literal for a Boolean or BIT(1) column.
function flagValue(dataType: string, value: boolean): string {
  if (dataType === 'bit') {
    return value ? `B'1'` : `B'0'`;
  }

  if (dataType === 'boolean') {
    return value ? 'TRUE' : 'FALSE';
  }

  throw new Error(
    `Unsupported flag column type "${dataType}". Expected boolean or bit.`
  );
}

async function updateRecords(
  client: PoolClient,
  tableName: 'oembranddetails' | 'dealerdetails',
  firmName: string
): Promise<number> {
  // Resolve column types from the current schema.
  const columns = await client.query(
    `
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = ANY(current_schemas(false))
        AND table_name = $1
        AND column_name IN ('isdeleted', 'isactive');
    `,
    [tableName]
  );

  const types = new Map<string, string>(
    columns.rows.map((row) => [row.column_name, row.data_type])
  );

  const isDeletedType = types.get('isdeleted');
  const isActiveType = types.get('isactive');

  if (!isDeletedType || !isActiveType) {
    throw new Error(
      `Could not find isdeleted/isactive columns for table "${tableName}" in the current schema.`
    );
  }

  const deletedValue = flagValue(isDeletedType, true);
  const inactiveValue = flagValue(isActiveType, false);
  const activeValue = flagValue(isActiveType, true);

  // Table names are restricted to the two known constants above.
  const result = await client.query(
    `
      UPDATE ${tableName}
      SET
        isdeleted = ${deletedValue},
        isactive = ${inactiveValue},
        modifiedby = NULL,
        modifiedon = NOW()
      WHERE firm_name = $1
        AND isactive = ${activeValue};
    `,
    [firmName]
  );

  console.log(
    `${tableName} cleanup completed. Rows updated: ${result.rowCount}`
  );

  return result.rowCount ?? 0;
}

export async function executeCleanupQueries(): Promise<void> {
  const client = await pool.connect();

  try {
    console.log('Connected to PostgreSQL');

    await client.query('BEGIN');

    const oemRows = await updateRecords(
      client,
      'oembranddetails',
      'InfoComm LLP'
    );

    const dealerRows = await updateRecords(
      client,
      'dealerdetails',
      'Himanshu'
    );

    await client.query('COMMIT');

    console.log('All cleanup queries completed successfully');
    console.log(`Total rows updated: ${oemRows + dealerRows}`);
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      console.error('Transaction rollback failed:', rollbackError);
    }

    console.error('PostgreSQL cleanup failed:', error);
    throw error;
  } finally {
    client.release();
  }
}



