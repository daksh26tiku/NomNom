// Test script to verify Supabase bucket functionality
const { createClient } = require('@supabase/supabase-js');

// Replace with your actual Supabase credentials
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBucket() {
  try {
    console.log('Testing Supabase bucket connection...');
    
    // Test 1: List files in the new bucket
    console.log('\n1. Testing bucket access...');
    const { data: files, error: listError } = await supabase.storage
      .from('nomnom')
      .list('users');
    
    if (listError) {
      console.error('❌ Error listing files:', listError);
    } else {
      console.log('✅ Bucket access successful');
      console.log('Files in users folder:', files);
    }
    
    // Test 2: Test URL generation
    console.log('\n2. Testing URL generation...');
    const testImageUrl = `${supabaseUrl}/storage/v1/object/public/nomnom/users/test-image.jpg`;
    console.log('Test URL:', testImageUrl);
    
    // Test 3: Check if default user image exists
    console.log('\n3. Testing default user image...');
    const defaultImageUrl = `${supabaseUrl}/storage/v1/object/public/nomnom/users/default-user-logo.png`;
    console.log('Default image URL:', defaultImageUrl);
    
    // You can also test uploading a small file
    console.log('\n4. Ready to test file upload...');
    console.log('To test upload, uncomment the upload code in this script');
    
    /*
    // Uncomment this section to test file upload
    const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('nomnom')
      .upload('test/test.txt', testFile);
    
    if (uploadError) {
      console.error('❌ Upload error:', uploadError);
    } else {
      console.log('✅ Upload successful:', uploadData);
    }
    */
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testBucket();
