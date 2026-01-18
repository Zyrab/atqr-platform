import React, { useMemo } from "react";
import { ShapeRenderers, FinderPattern } from "./rendering/shape-renderers";

type QRCodeMatrix = (number | boolean)[][];
type DotType = string;
type EyeFrameType = string;
type EyeBallType = string;

const isFinderPattern = (x: number, y: number, size: number) =>
  (x < 7 && y < 7) || (x > size - 8 && y < 7) || (x < 7 && y > size - 8);

const isLogoZone = (x: number, y: number, size: number, logoSize: number) => {
  if (!logoSize) return false;
  const center = Math.floor(size / 2);
  const half = Math.ceil(logoSize / 2);
  return x >= center - half && x <= center + half && y >= center - half && y <= center + half;
};
const isDarkAt = (matrix: QRCodeMatrix, x: number, y: number, size: number, logoBlockSize: number) => {
  if (!matrix[y]?.[x]) return false;
  if (isFinderPattern(x, y, size)) return false;
  if (isLogoZone(x, y, size, logoBlockSize)) return false;
  return true;
};

interface QRCodeRendererProps {
  matrix: QRCodeMatrix;
  size?: number;
  svgRef: React.RefObject<SVGSVGElement | null>;
  dotType?: DotType;
  eyeFrame?: EyeFrameType;
  eyeBall?: EyeBallType;
  logoUrl?: string | null;
  bodyColor?: string;
  eyeColor?: string;
  bgColor?: string;
  logoSizeRatio?: number;
}

const QRCodeRenderer: React.FC<QRCodeRendererProps> = ({
  matrix = [],
  size = 300,
  svgRef = null,
  dotType = "square",
  eyeFrame = "square",
  eyeBall = "square",
  logoUrl = null,
  bodyColor = "#000000",
  eyeColor = "#000000",
  bgColor = "transparent",
  logoSizeRatio = 0.15,
}) => {
  const gridSize = matrix.length;
  const logoBlockSize = logoUrl ? Math.floor(gridSize * logoSizeRatio) + 2 : 0;

  const dataPath = useMemo(() => {
    if (!gridSize) return null;
    const elements: React.ReactNode[] = [];
    matrix.forEach((row, y) => {
      row.forEach((isDark, x) => {
        if (!isDark) return;

        // SKIP ZONES
        if (isFinderPattern(x, y, gridSize)) return;
        if (isLogoZone(x, y, gridSize, logoBlockSize)) return;

        const neighbors = {
          top: isDarkAt(matrix, x, y - 1, gridSize, logoBlockSize),
          bottom: isDarkAt(matrix, x, y + 1, gridSize, logoBlockSize),
          left: isDarkAt(matrix, x - 1, y, gridSize, logoBlockSize),
          right: isDarkAt(matrix, x + 1, y, gridSize, logoBlockSize),
        };

        const Renderer = ShapeRenderers[dotType] || ShapeRenderers.square;

        elements.push(
          <React.Fragment key={`${x}-${y}`}>
            <Renderer x={x} y={y} size={size} neighbors={neighbors} color={bodyColor} />
          </React.Fragment>,
        );
      });
    });

    return elements;
  }, [matrix, gridSize, dotType, logoBlockSize, bodyColor, size]);

  if (!gridSize) return null;

  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${gridSize} ${gridSize}`}
        className="relative z-10"
        style={{ maxWidth: "100%", maxHeight: "100%" }}
      >
        {dataPath}

        <FinderPattern x={0} y={0} frameType={eyeFrame} ballType={eyeBall} color={eyeColor} position="tl" />
        <FinderPattern x={gridSize - 7} y={0} frameType={eyeFrame} ballType={eyeBall} color={eyeColor} position="tr" />
        <FinderPattern x={0} y={gridSize - 7} frameType={eyeFrame} ballType={eyeBall} color={eyeColor} position="bl" />

        {logoUrl && (
          <image
            href={logoUrl}
            x={gridSize / 2 - logoBlockSize / 2}
            y={gridSize / 2 - logoBlockSize / 2}
            width={logoBlockSize}
            height={logoBlockSize}
            preserveAspectRatio="xMidYMid slice"
          />
        )}
      </svg>
    </div>
  );
};

export default React.memo(QRCodeRenderer);
