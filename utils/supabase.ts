import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nzblsjrpwntfpaqvsgfh.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export const storage = supabase.storage;

export default supabase;