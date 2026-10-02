import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cgksnbfhmbwozuadqouf.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_WJqfaLPVNCbjXW_gqdrsYw_g40Eh4n7';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
