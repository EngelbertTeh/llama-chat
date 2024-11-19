// import sql from '@/app/service/db';
// import { createSupabase } from '@/app/service/db-conn-service';
// import { sql } from '@vercel/postgres';
import pg from 'pg';

export async function proceduralCall(message: string) {
  // make supabase db call
  //   const supabase = createSupabase();
  // const supabase = await createSupabase();

  // return await sql`SELECT * FROM Employee`;

  // try {
  //   const rows = await sql`SELECT * FROM Employee`;
  //   return rows;
  // } catch (e) {
  //   console.log('error is ', e);
  //   return query;
  // }

  const { Pool } = pg;
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });

  const client = await pool.connect();
  console.log('message in db service???:', message);
  const response = await client.query(message);
  console.log('response:', response.rows);
  client.release();
  return response.rows;
}
