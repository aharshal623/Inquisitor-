// supabase.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://fynhpirgdxgbkhzuqpon.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5bmhwaXJnZHhnYmtoenVxcG9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg5MDkwODksImV4cCI6MjAyNDQ4NTA4OX0.pkOzDA8HMi04rMe2GmT-klvSbXoOyYfnw48lLWqNG1o";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

