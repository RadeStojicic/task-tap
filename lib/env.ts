const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const env = {
  supabaseUrl,
  supabaseAnonKey,
  restUrl: `${supabaseUrl}/rest/v1`,
}

export function isSupabaseConfigured(): boolean {
  return (
    !!supabaseUrl &&
    !!supabaseAnonKey &&
    !supabaseUrl.includes('YOUR_PROJECT_REF') &&
    !supabaseAnonKey.includes('YOUR_SUPABASE_ANON_KEY')
  )
}
