
/**
 * Compresses an image file client-side to be under a certain size in MB.
 */
export async function compressImage(file: File, maxMb: number = 3.5): Promise<File> {
  const maxBytes = maxMb * 1024 * 1024;
  
  // If file is already smaller than max, return it
  if (file.size < maxBytes) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Start by reducing dimensions if image is very large
        const maxDimension = 2048;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(file);
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Try different quality levels (0.9 to 0.1) until size is small enough
        let quality = 0.9;
        const tryCompress = (q: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                return resolve(file);
              }
              
              if (blob.size < maxBytes || q <= 0.1) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                tryCompress(q - 0.1);
              }
            },
            'image/jpeg',
            q
          );
        };

        tryCompress(quality);
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}
