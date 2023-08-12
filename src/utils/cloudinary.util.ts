import { fill } from '@cloudinary/url-gen/actions/resize';
import { CloudinaryImage } from '@cloudinary/url-gen';

interface ICloudinaryData {
  public_id: string;
  secure_url: string;
  resource_type: string;
  original_filename: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

const endpoint = `https://api.cloudinary.com/v1_1/${
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
}/image/upload`;

export const newImage = () =>
  new CloudinaryImage('litee-snack', {
    cloudName: 'litee-app',
  }).resize(fill().width(150).height(150));

export const uploadImage = async (
  image: File,
): Promise<{ data: ICloudinaryData | null; error: string }> => {
  const form = new FormData();
  form.append('file', image);
  form.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET_NAME);
  form.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      body: form,
    });
    const data: ICloudinaryData = await res.json();
    return { data, error: '' };
  } catch (error) {
    if (error instanceof Error) return { error: error.message, data: null };
  }

  return { data: null, error: '' };
};
