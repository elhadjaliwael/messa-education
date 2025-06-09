// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET, // You'll need to create this
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY
};

// Direct upload function
export const uploadToCloudinary = async (file, options = {}) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  formData.append('folder', options.folder || 'messages_attachments');
  
  if (options.publicId) {
    formData.append('public_id', options.publicId);
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      fileUrl: result.secure_url,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      cloudinaryId: result.public_id,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Upload with progress tracking
export const uploadToCloudinaryWithProgress = (file, options = {}, onProgress) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);
    formData.append('folder', options.folder || 'messages_attachments');
    
    if (options.publicId) {
      formData.append('public_id', options.publicId);
    }

    const xhr = new XMLHttpRequest();
    
    // Track upload progress
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const percentComplete = (event.loaded / event.total) * 100;
        onProgress(percentComplete);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const result = JSON.parse(xhr.responseText);
        resolve({
          fileUrl: result.secure_url,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          cloudinaryId: result.public_id,
          width: result.width,
          height: result.height
        });
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`);
    xhr.send(formData);
  });
};