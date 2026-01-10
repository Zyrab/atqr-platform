import QRCode from "qrcode"

export const generateQRCode = async (
  canvasEl: HTMLCanvasElement, 
  text: string, 
  color: string = "#000000",
  logoSource?: string | File | Blob | null
) => {
  if (!text) return;

  try {
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;

    // 1. Generate QR with HIGH Error Correction
    await QRCode.toCanvas(canvasEl, text, {
      width: 300,
      margin: 2,
      errorCorrectionLevel: "H",
      color: {
        dark: color,
        light: "#ffffff",
      },
    });

    // 2. Handle Logo
    if (logoSource) {
      const img = new Image();
      // Important for avoiding "tainted canvas" errors if loading from external URLs
      img.crossOrigin = "anonymous";

      let url = "";
      let isObjectUrl = false;

      // Handle File vs Base64 String
      if (logoSource instanceof File || logoSource instanceof Blob) {
        url = URL.createObjectURL(logoSource);
        isObjectUrl = true;
      } else if (typeof logoSource === 'string') {
        url = logoSource;
      }

      img.onload = () => {
        // Calculate safe logo size (Max 25% of QR width)
        const canvasWidth = canvasEl.width;
        const maxLogoSize = canvasWidth * 0.25;

        const x = (canvasWidth - maxLogoSize) / 2;
        const y = (canvasWidth - maxLogoSize) / 2;

        // 3. Draw a "Quiet Zone" (White Background) behind the logo
        ctx.fillStyle = "#ffffff";
        const padding = 6;
        ctx.fillRect(x - padding / 2, y - padding / 2, maxLogoSize + padding, maxLogoSize + padding);

        // 4. Draw the Logo
        ctx.drawImage(img, x, y, maxLogoSize, maxLogoSize);

        if (isObjectUrl) URL.revokeObjectURL(url);
      };

      img.src = url;
    }
  } catch (err) {
    console.error("QR Generation failed", err);
  }
};

// Helper to trigger download
export const downloadCanvas = (canvasEl: HTMLCanvasElement | null) => {
  if (!canvasEl) return;
  const link = document.createElement("a");
  link.download = `qrcode-${Date.now()}.png`;
  link.href = canvasEl.toDataURL("image/png");
  link.click();
};

export const resizeImage = (file: File, maxDimension = 150): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round(height * (maxDimension / width));
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round(width * (maxDimension / height));
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Return Base64 String
            const dataUrl = canvas.toDataURL("image/png", 0.9);
            resolve(dataUrl);
        } else {
            reject(new Error("Canvas context not available"));
        }
      };

      img.onerror = reject;
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};