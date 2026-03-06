const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
    console.log('Testing cities search with q=mum...');
    const { data, error } = await supabase
        .from('cities')
        .select(`
            id,
            name,
            country_id,
            countries (name)
        `)
        .ilike('name', `mum%`)
        .limit(8);

    console.log('Data:', JSON.stringify(data, null, 2));
    console.log('Error:', error);
}

check();
