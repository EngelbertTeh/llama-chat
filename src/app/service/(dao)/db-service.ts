import sql from '@/app/service/db';
import { createSupabase } from '@/app/service/db-conn-service';

export async function proceduralCall() {
  // make supabase db call
  //   const supabase = createSupabase();
  const supabase = await createSupabase();

  return await sql`SELECT * FROM Employee`;
}
