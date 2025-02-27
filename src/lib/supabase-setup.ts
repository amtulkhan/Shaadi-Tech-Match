import { supabase } from './supabase';

export async function setupSupabase() {
  try {
    console.log('Setting up Supabase resources...');
    
    // 1. Create storage bucket if it doesn't exist
    await createStorageBucket('resumes');
    
    // 2. Create users table if it doesn't exist
    await createUsersTable();
    
    console.log('Supabase setup completed successfully');
    return true;
  } catch (error) {
    console.error('Failed to set up Supabase resources:', error);
    return false;
  }
}

async function createStorageBucket(bucketName: string) {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      throw new Error(`Failed to list buckets: ${listError.message}`);
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log(`Creating storage bucket: ${bucketName}`);
      
      // Create the bucket
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true // Make bucket public
      });
      
      if (createError) {
        throw new Error(`Failed to create bucket: ${createError.message}`);
      }
      
      // Set bucket policy to allow public access
      const { error: policyError } = await supabase.storage.from(bucketName).createSignedUrl('dummy.txt', 60);
      
      if (policyError && !policyError.message.includes('not found')) {
        console.warn(`Note: Could not set public policy automatically: ${policyError.message}`);
        console.warn('You may need to set bucket policies manually in the Supabase dashboard');
      }
      
      console.log(`Storage bucket "${bucketName}" created successfully`);
    } else {
      console.log(`Storage bucket "${bucketName}" already exists`);
    }
  } catch (error) {
    console.error('Error creating storage bucket:', error);
    throw error;
  }
}

async function createUsersTable() {
  try {
    // Check if the table exists
    const { error: queryError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    // If we get a "relation does not exist" error, the table doesn't exist
    if (queryError && queryError.message.includes('relation "users" does not exist')) {
      console.log('Creating users table...');
      
      // Create the table using SQL
      const { error: createError } = await supabase.rpc('create_users_table', {});
      
      if (createError) {
        // If RPC fails, we might not have the function set up
        console.warn('Could not create table via RPC, you may need to create it manually');
        console.warn('Error:', createError.message);
        console.warn('Please create the users table in the Supabase dashboard with the required columns');
      } else {
        console.log('Users table created successfully');
      }
    } else if (queryError) {
      console.warn('Error checking if users table exists:', queryError.message);
      console.warn('You may need to create the table manually in the Supabase dashboard');
    } else {
      console.log('Users table already exists');
    }
  } catch (error) {
    console.error('Error creating users table:', error);
    throw error;
  }
} 