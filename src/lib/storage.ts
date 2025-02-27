import type { UserData, FormData } from '../types';
import { supabase } from './supabase';

const STORAGE_KEY = 'techshaadi_users';
const STORAGE_BUCKET = 'resumes';

export async function saveUserData(formData: FormData): Promise<void> {
  try {
    // 1. Upload resume file to Supabase Storage
    let resumeUrl = '';
    if (formData.resumeFile) {
      const fileExt = formData.resumeFile.name.split('.').pop();
      const fileName = `${Date.now()}-${formData.name.replace(/\s+/g, '-').toLowerCase()}.${fileExt}`;
      
      try {
        // Upload file to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(fileName, formData.resumeFile, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (uploadError) {
          console.error('Resume upload error:', uploadError);
          throw new Error(`Failed to upload resume: ${uploadError.message}`);
        }
        
        // Get public URL for the uploaded file
        const { data: urlData } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(fileName);
        
        resumeUrl = urlData.publicUrl;
      } catch (uploadErr) {
        console.error('Resume upload failed:', uploadErr);
        // Continue with the rest of the form submission even if file upload fails
      }
    }
    
    // 2. Insert user data into Supabase database
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        tech_stack: formData.techStack,
        interests: formData.interests,
        resume_url: resumeUrl,
        created_at: new Date().toISOString()
      });
    
    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error(`Failed to save user data: ${insertError.message}`);
    }
    
    // 3. Also keep local storage for backward compatibility
    try {
      const localUsers = localStorage.getItem(STORAGE_KEY);
      const users = localUsers ? JSON.parse(localUsers) : [];
      users.push({
        name: formData.name,
        phone: formData.phone,
        resumeUrl,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch (localStorageErr) {
      console.error('LocalStorage error:', localStorageErr);
      // Continue even if localStorage fails
    }
    
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
}

export async function getUserData(): Promise<UserData[]> {
  try {
    // Get data from Supabase
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase fetch error:', error);
      throw error;
    }
    
    if (!data) {
      return [];
    }
    
    // Transform to match UserData type
    return data.map(user => ({
      name: user.name,
      phone: user.phone,
      resumeUrl: user.resume_url || '',
      createdAt: user.created_at
    }));
  } catch (error) {
    console.error('Error fetching user data from Supabase:', error);
    
    // Fallback to local storage
    try {
      const localData = localStorage.getItem(STORAGE_KEY);
      return localData ? JSON.parse(localData) : [];
    } catch (localErr) {
      console.error('LocalStorage read error:', localErr);
      return [];
    }
  }
}

export async function exportUserData(): Promise<void> {
  const users = await getUserData();
  const headers = 'Name,Phone,Resume URL,Created At\n';
  const csvContent = headers + users.map(user => 
    `"${user.name}","${user.phone}","${user.resumeUrl}","${user.createdAt}"`
  ).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `techshaadi_users_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}