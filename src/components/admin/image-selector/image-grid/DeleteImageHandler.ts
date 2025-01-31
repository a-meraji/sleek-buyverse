import { supabase } from "@/integrations/supabase/client";

export async function deleteImage(filePath: string): Promise<void> {
  console.log('Starting image deletion process for:', filePath);
  
  try {
    // Attempt to delete the file
    const { error: deleteError } = await supabase.storage
      .from('images')
      .remove([filePath]);

    if (deleteError) {
      console.error('Error during deletion:', deleteError);
      throw deleteError;
    }

    // Add a small delay before verification to allow for deletion propagation
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify deletion
    const { data: fileList, error: listError } = await supabase.storage
      .from('images')
      .list(filePath.split('/').slice(0, -1).join('/'), {
        search: filePath.split('/').pop()
      });

    if (listError) {
      console.error('Error verifying deletion:', listError);
      throw listError;
    }

    if (fileList && fileList.length > 0) {
      console.error('File still exists after deletion attempt');
      throw new Error('Failed to delete file - file still exists after deletion');
    }

    console.log('Image successfully deleted:', filePath);
  } catch (error) {
    console.error('Error in deleteImage function:', error);
    throw error;
  }
}