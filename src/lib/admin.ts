import { supabase } from './supabase';

export async function exportUserData() {
  try {
    const { data, error } = await supabase
      .rpc('export_user_data');

    if (error) throw error;

    // Create CSV content with headers
    const headers = 'Name,Phone,Resume URL,Signup Date,Last Updated\n';
    const csvContent = headers + data;

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `techshaadi_users_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error('Error exporting user data:', error);
    return false;
  }
}