import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nzblsjrpwntfpaqvsgfh.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export const storage = supabase.storage;

export default supabase;

type UploadFileOptions = {
    bucket: string;
    folder?: string; // Optional: Specify a folder within the bucket
    file: File | Blob | Buffer; // The file to upload
    // file: any,
    fileName: string; // Optional: Custom file name
    mimeType: string;
};

export const uploadFile = async ({
    bucket,
    file,
    fileName,
    // folder = "",
    mimeType,
}: UploadFileOptions): Promise<{
    success: boolean,
    url?: string,
    error?: string
    path?: string
}> => {
    try {
        // Check if a file name contains spaces or not 
        const { data, error } = await storage.from(bucket).upload(fileName, file, {
            contentType: mimeType
        });

        if (error) {
            return { success: false, error: error.message };
        }

        const { data: { publicUrl } } = await storage.from(bucket).getPublicUrl(data?.fullPath);

        return { success: true, url: publicUrl, path: data.path }

    } catch (error: any) {
        return { success: false, error: error.message || "Unknown error occurred" };
    }
}


export const deleteFile = async ({
    bucket,
    publicUrl
}: {
    bucket: string,
    publicUrl: string
}): Promise<{
    success: boolean;
    error?: string;
    data?: object | string
}> => {
    try {

        const urlParts = publicUrl.split(`/storage/v1/object/public/${bucket}/`);
        if (urlParts.length < 2) {
            throw new Error('Invalid public URL or bucket name.');
        }

        const tempUrl = urlParts[1].split('thumbnails/')

        console.log(tempUrl);

        const { data, error } = await storage.from(bucket).remove([tempUrl[1]]);

        console.log(data, error);

        if (error) {
            console.error('Error deleting file:', error.message);
            return { success: false, error: error.message };
        }

        return { success: true, data };

    } catch (error: any) {
        return { success: false, error: error.message || "Unknown error occurred" };
    }
}

export function generateFileName(filename: string, title: string): string {
    // Helper function to sanitize input by replacing spaces/special characters with underscores
    const sanitize = (input: string) =>
        input.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

    // Extract file name without extension
    const baseName = filename.split('.')[0];

    // Extract file extension
    const extension = filename.split('.').pop();

    // Sanitize the base name and title
    const sanitizedBaseName = sanitize(baseName);
    const sanitizedTitle = sanitize(title);

    // Combine sanitized base name, title, and extension
    return `${sanitizedBaseName}-${sanitizedTitle}.${extension}`;
}