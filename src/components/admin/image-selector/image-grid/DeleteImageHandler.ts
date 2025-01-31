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

    // Wait longer for deletion to be processed (3 seconds)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Verify deletion with retries
    let retries = 3;
    while (retries > 0) {
      console.log(`Verifying deletion (attempts remaining: ${retries})...`);
      
      const { data: fileExists } = await supabase.storage
        .from('images')
        .list(filePath.split('/').slice(0, -1).join('/'), {
          search: filePath.split('/').pop()
        });

      if (!fileExists || fileExists.length === 0) {
        console.log('Image successfully deleted:', filePath);
        return;
      }

      retries--;
      if (retries > 0) {
        // Wait between retries
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    throw new Error('File still exists after multiple deletion attempts');
  } catch (error) {
    console.error('Error in deleteImage function:', error);
    throw error;
  }
}