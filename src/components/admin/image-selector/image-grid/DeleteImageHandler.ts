import { supabase } from "@/integrations/supabase/client";

export async function deleteImage(filePath: string): Promise<void> {
  console.log('Starting image deletion process for:', filePath);
  
  const { error: deleteError } = await supabase.storage
    .from('images')
    .remove([filePath]);

  if (deleteError) {
    console.error('Error during deletion:', deleteError);
    throw deleteError;
  }

  // Wait for deletion to be processed
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Verify deletion
  const { data: fileExists } = await supabase.storage
    .from('images')
    .list(filePath.split('/').slice(0, -1).join('/'), {
      search: filePath.split('/').pop()
    });

  if (fileExists && fileExists.length > 0) {
    console.error('File still exists after deletion attempt');
    throw new Error('File still exists after deletion');
  }

  console.log('Image successfully deleted:', filePath);
}