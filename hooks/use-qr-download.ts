import { useState, useCallback } from "react";

type FileFormat = "png" | "jpeg" | "svg";

export const useQRDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadQrCode = useCallback(
    async (svgRef: React.RefObject<SVGSVGElement | null>, filename: string, format: FileFormat, size: number = 1000) => {
      if (!svgRef.current) return;
      setIsDownloading(true);

      try {
        const originalSvg = svgRef.current;
        const clonedSvg = originalSvg.cloneNode(true) as SVGSVGElement;
        
        const logoImage = clonedSvg.querySelector("image");
        const logoHref = logoImage?.getAttribute("href");
        const isLogoPresent = logoImage && logoHref && (logoHref.startsWith("http") || logoHref.startsWith("blob:"));

        if (isLogoPresent) {
          try {
            const response = await fetch(logoHref, { mode: "cors" });
            const blob = await response.blob();
            
            const base64 = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            });

            logoImage.setAttribute("href", base64);
          } catch (e) {
            console.warn("Failed to inline logo. The downloaded QR might be missing the logo.", e);
          }
        }

        // 3. Serialize the CLONED SVG (now containing the embedded logo)
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(clonedSvg);

        const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        if (format === "svg") {
          const link = document.createElement("a");
          link.href = url;
          link.download = `${filename}.svg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          setIsDownloading(false);
          return;
        }

        // Handle Raster (PNG/JPG)
        const img = new Image();
        
        img.crossOrigin = "anonymous"; 

        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;

          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          if (format === "jpeg") {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, size, size);
          }

          ctx.drawImage(img, 0, 0, size, size);

          const dataUrl = canvas.toDataURL(`image/${format}`, 1.0);

          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `${filename}.${format}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          URL.revokeObjectURL(url);
          setIsDownloading(false);
        };

        img.onerror = (e) => {
          console.error("Failed to load SVG for conversion", e);
          setIsDownloading(false);
        };

        img.src = url;
      } catch (error) {
        console.error("Download failed:", error);
        setIsDownloading(false);
      }
    },
    [],
  );

  return { downloadQrCode, isDownloading };
};