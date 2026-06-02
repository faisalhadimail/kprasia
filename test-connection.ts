import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔍 Testing Supabase Connection...')
  console.log('URL:', supabaseUrl)
  console.log('Key:', supabaseKey.substring(0, 20) + '...')

  try {
    // Test 1: Check if we can access the database
    const { data, error } = await supabase
      .from('_test_connection')
      .select('*')
      .limit(1)

    if (error) {
      // Expected error - table doesn't exist, but connection works
      if (error.message.includes('does not exist') || error.code === '42P01') {
        console.log('✅ Database Connection: SUCCESS')
        console.log('   (Table does not exist yet, which is expected)')
        return true
      } else {
        console.log('❌ Database Connection: FAILED')
        console.log('   Error:', error)
        return false
      }
    }

    console.log('✅ Database Connection: SUCCESS')
    return true
  } catch (error) {
    console.log('❌ Database Connection: FAILED')
    console.log('   Error:', error)
    return false
  }
}

testConnection()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(err => {
    console.error('Test failed:', err)
    process.exit(1)
  })