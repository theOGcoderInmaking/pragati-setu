const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
    console.log('Testing airports search with q=BOM...');
    const { data, error } = await supabase
        .from('airports')
        .select(`
            id,
            name,
            iata_code,
            city_id,
            cities!airports_city_fk (
                name,
                countries (name)
            )
        `)
        .or(`name.ilike.%BOM%,iata_code.ilike.BOM%`)
        .limit(8);

    console.log('Data:', JSON.stringify(data, null, 2));
    console.log('Error:', error);
}

check();
