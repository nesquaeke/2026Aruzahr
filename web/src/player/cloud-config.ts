// Public browser credentials, NOT a service_role/secret key. RLS protects rows.
// Build environment values override this project's default configuration.
const env = (import.meta as unknown as {env: Record<string,string>}).env;
export const cloudUrl = (env.VITE_SUPABASE_URL ?? 'https://jrjwhgjqykztacijwwcr.supabase.co').replace(/\/$/, '');
export const cloudPublicKey = env.VITE_SUPABASE_ANON_KEY ?? 'sb_publishable_-jf1HV66hoP0qoTjHqNe4g_Z_RFZDSI';
