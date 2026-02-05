
export const resizeImage = (file: File, maxDimension = 300): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const srcWidth = img.naturalWidth;
        const srcHeight = img.naturalHeight;

        const scale = Math.min(
          maxDimension / srcWidth,
          maxDimension / srcHeight,
          1
        );

        const width = Math.round(srcWidth * scale);
        const height = Math.round(srcHeight * scale);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context error"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/png"));
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
};

