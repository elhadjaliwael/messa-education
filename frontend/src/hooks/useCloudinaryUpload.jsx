import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const CLOUDINARY_CLOUD_NAME = "dc6hczfu5";
const CLOUDINARY_UPLOAD_PRESET = "messa_education";

export const useCloudinaryUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadToCloudinary = async (file, onProgress) => {
    if (!file) {
      toast.error('No file selected');
      return null;
    }

    if (!file.type.startsWith('video/')) {
      toast.error('Please select a video file');
      return null;
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 100MB');
      return null;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('resource_type', 'video');

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
            if (onProgress) onProgress(progress);
          },
        }
      );

      toast.success('Video uploaded successfully!');
      return {
        url: response.data.secure_url,
        publicId: response.data.public_id
      };
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    uploadToCloudinary,
    uploadProgress,
    isUploading
  };
};