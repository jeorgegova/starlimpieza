import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gvivprtrbphfvedbiice.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2aXZwcnRyYnBoZnZlZGJpaWNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMzA1NjUsImV4cCI6MjA3MjcwNjU2NX0.BPJI-HnSRRSkKxBo15X52HtViUxI3G6hhO53jnoAcko';
export const supabase = createClient(supabaseUrl, supabaseKey);
