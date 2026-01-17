import QRCode from "qrcode";

export type QRStyle = "square" | "dots" | "rounded";
export type LogoStyle = "square" | "circle" | "none" | "trace";

export interface QRCodeOptions {
  color: string;
  style?: QRStyle;
  logoStyle?: LogoStyle;
}

// --- CANVAS GENERATION ---
export const generateQRCode = async (
  canvas: HTMLCanvasElement,
  text: string,
  options: QRCodeOptions = { color: "#000000", style: "square", logoStyle: "square" },
  logoSource?: string | File | Blob | null
) => {
  if (!text || !canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  try {
    // 1. Get Raw QR Data
    const qrData = QRCode.create(text, {
      errorCorrectionLevel: "H", // High error correction allows covering ~30% of code
    });
    
    const modules = qrData.modules;
    const size = modules.size;
    const data = modules.data;

    // 2. Setup Canvas High Resolution
    const pixelSize = 10;
    const padding = 1;
    const canvasSize = (size + padding * 2) * pixelSize;
    
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    // Clear and fill white
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // 3. Draw Modules
    ctx.fillStyle = options.color;
    
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const isActive = data[row * size + col]; 

        if (isActive) {
          const x = (col + padding) * pixelSize;
          const y = (row + padding) * pixelSize;

          // Detect Finder Patterns (3 big squares)
          const isFinder = 
             (row < 7 && col < 7) || 
             (row < 7 && col >= size - 7) || 
             (row >= size - 7 && col < 7);

          if (isFinder) {
             ctx.fillRect(x, y, pixelSize, pixelSize);
             continue;
          }

          // Draw Style
          if (options.style === "dots") {
            ctx.beginPath();
            ctx.arc(x + pixelSize / 2, y + pixelSize / 2, pixelSize / 2, 0, Math.PI * 2);
            ctx.fill();
          } else if (options.style === "rounded") {
             ctx.beginPath();
             const r = pixelSize * 0.35;
             ctx.roundRect(x, y, pixelSize, pixelSize, r);
             ctx.fill();
          } else {
            ctx.fillRect(x, y, pixelSize + 0.5, pixelSize + 0.5);
          }
        }
      }
    }

    // 4. Draw Logo
    if (logoSource) {
      await drawLogoOnCanvas(ctx, logoSource, canvasSize, options.logoStyle || "square");
    }

  } catch (err) {
    console.error("QR Gen Error:", err);
  }
};

// Helper: Draws logo
const drawLogoOnCanvas = async (
    ctx: CanvasRenderingContext2D, 
    source: string | File | Blob, 
    canvasSize: number,
    style: LogoStyle
) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    let url = "";
    let isObjectUrl = false;

    if (source instanceof File || source instanceof Blob) {
      url = URL.createObjectURL(source);
      isObjectUrl = true;
    } else {
      url = source as string;
    }

    return new Promise<void>((resolve) => {
        img.onload = () => {
            // Calculate Aspect Ratio
            const imgAspect = img.width / img.height;
            
            // Max bounds: 25% of canvas width/height
            // We ensure it fits within the center safe zone
            const maxW = canvasSize * 0.2; // slightly larger allowance
            const maxH = canvasSize * 0.2;

            let logoW, logoH;

            // Fit logic (Contain)
            if (imgAspect > 1) {
                // Wide image
                logoW = maxW;
                logoH = maxW / imgAspect;
            } else {
                // Tall or square image
                logoH = maxH;
                logoW = maxH * imgAspect;
            }

            const x = (canvasSize - logoW) / 2;
            const y = (canvasSize - logoH) / 2;

            ctx.save();

            // --- Background/Quiet Zone Logic ---
            if (style === "trace") {
                // "Stroke" effect: Create a temp canvas, draw logo in white, draw larger/shadow
                const buffer = document.createElement('canvas');
                buffer.width = logoW;
                buffer.height = logoH;
                const bctx = buffer.getContext('2d');
                if (bctx) {
                    bctx.drawImage(img, 0, 0, logoW, logoH);
                    // Turn opaque pixels to white
                    bctx.globalCompositeOperation = 'source-in';
                    bctx.fillStyle = 'white';
                    bctx.fillRect(0, 0, logoW, logoH);
                    
                    // Draw the white silhouette with a heavy white shadow (glow)
                    ctx.shadowColor = "white";
                    ctx.shadowBlur = 55; 
                    ctx.drawImage(buffer, x, y);
                    ctx.drawImage(buffer, x, y); 
                    ctx.drawImage(buffer, x, y); // Multiple passes to make the glow solid
                    ctx.shadowBlur = 0; // Reset
                }
            } 
            else if (style !== "none") {
                // Standard Box/Circle
                ctx.fillStyle = "#ffffff";
                const pad = 6;
                
                ctx.beginPath();
                if (style === "circle") {
                    // For circle, we base it on the largest dimension to ensure coverage
                    const radius = (Math.max(logoW, logoH) + pad) / 2;
                    ctx.arc(canvasSize/2, canvasSize/2, radius, 0, Math.PI * 2);
                } else {
                    // Square/Rect container matching aspect ratio
                    ctx.roundRect(x - pad/2, y - pad/2, logoW + pad, logoH + pad, 4);
                }
                ctx.fill();
            }

            // --- Draw Actual Logo ---
            // If circular style, clip it
            if (style === "circle") {
                 ctx.beginPath();
                 const radius = Math.min(logoW, logoH) / 2;
                 ctx.arc(canvasSize/2, canvasSize/2, radius, 0, Math.PI * 2);
                 ctx.clip();
            }
            
            ctx.drawImage(img, x, y, logoW, logoH);
            ctx.restore();

            if (isObjectUrl) URL.revokeObjectURL(url);
            resolve();
        };
        img.src = url;
    });
}

export const downloadAsPNG = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `qrcode-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
}

export const downloadAsSVG = async (text: string, color: string) => {
   const svg = await QRCode.toString(text, {
        type: 'svg',
        color: { dark: color, light: "#ffffff" }
   });
   const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
   const link = document.createElement("a");
   link.href = URL.createObjectURL(blob);
   link.download = `qrcode-${Date.now()}.svg`;
   link.click();
}

export const resizeImage = (file: File, maxDimension = 300): Promise<string> => {
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
            resolve(canvas.toDataURL("image/png", 0.9));
        } else { reject(new Error("Canvas context error")); }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};