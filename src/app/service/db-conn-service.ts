import { createClient } from '@/utils/supabase/servers';
import { cookies } from 'next/headers';

export async function createSupabase() {
  const cookieStore = await cookies();
  return createClient(cookieStore);
}
