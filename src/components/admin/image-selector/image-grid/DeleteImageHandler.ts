import { supabase } from "@/integrations/supabase/client";

export async function deleteImage(filePath: string): Promise<void> {
  console.log('Starting image deletion process for:', filePath);
  
  try {
    // First attempt to delete
    const { error: deleteError } = await supabase.storage
      .from('images')
      .remove([filePath]);

    if (deleteError) {
      console.error('Error during initial deletion:', deleteError);
      throw deleteError;
    }

    // Verify deletion immediately
    const { data: fileExists, error: listError } = await supabase.storage
      .from('images')
      .list(filePath.split('/').slice(0, -1).join('/'), {
        search: filePath.split('/').pop()
      });

    if (listError) {
      console.error('Error verifying deletion:', listError);
      throw listError;
    }

    if (fileExists && fileExists.length > 0) {
      console.error('File still exists after deletion attempt');
      throw new Error('Failed to delete file');
    }

    console.log('Image successfully deleted:', filePath);
  } catch (error) {
    console.error('Error in deleteImage function:', error);
    throw error;
  }
}