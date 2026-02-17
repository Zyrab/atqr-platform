import React, { useMemo } from "react";
import { FinderPattern, ShapeRenderers } from "./rendering/shape-renderers";
// import { ShapeRenderers } from "./rendering/body-shape-renderer";

import { QRCodeRendererProps, QRCodeMatrix } from "@/types/qr";

const NEIGHBOR_DEPENDENT_SHAPES = new Set(["fluid", "soft", "blobH", "blobV", "extraFluid", "sharp"]);

const isFinderPattern = (x: number, y: number, size: number) =>
  (x < 7 && y < 7) || (x > size - 8 && y < 7) || (x < 7 && y > size - 8);

const isLogoZone = (x: number, y: number, size: number, logoSize: number) => {
  if (!logoSize) return false;
  const center = Math.floor(size / 2);
  const half = Math.ceil(logoSize / 2);
  return x >= center - half && x <= center + half && y >= center - half && y <= center + half;
};
const isDarkAt = (matrix: QRCodeMatrix, x: number, y: number, size: number, logoBlockSize: number) => {
  if (x < 0 || y < 0 || x >= size || y >= size) return 0;
  if (!matrix[y]?.[x]) return 0;
  if (isFinderPattern(x, y, size)) return 0;
  if (isLogoZone(x, y, size, logoBlockSize)) return 0;

  return 1;
};

const QRCodeRenderer: React.FC<QRCodeRendererProps> = ({ matrix = [], size = 300, svgRef = null, design }) => {
  const {
    dotType = "square",
    eyeFrame = "square",
    eyeBall = "square",
    logo = null,
    bodyColor = "#000000",
    eyeColor = "#000000",
    bgColor = "transparent",
    logoSizeRatio = 0.2,
  } = design;

  const padding = 2;
  const gridSize = matrix.length;
  const totalSize = gridSize + padding * 2;

  const logoBlockSize = useMemo(
    () => (logo ? Math.floor(gridSize * logoSizeRatio) + 2 : 0),
    [gridSize, logo, logoSizeRatio],
  );

  const dataPath = useMemo(() => {
    if (!gridSize) return null;
    const elements: React.ReactNode[] = [];

    const needsNeighbors = NEIGHBOR_DEPENDENT_SHAPES.has(dotType);

    const Renderer = ShapeRenderers[dotType] || ShapeRenderers.square;

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (!matrix[y][x]) continue;
        if (isFinderPattern(x, y, gridSize)) continue;
        if (isLogoZone(x, y, gridSize, logoBlockSize)) continue;

        let neighbors = undefined;

        if (needsNeighbors) {
          const top = isDarkAt(matrix, x, y - 1, gridSize, logoBlockSize);
          const bottom = isDarkAt(matrix, x, y + 1, gridSize, logoBlockSize);
          const left = isDarkAt(matrix, x - 1, y, gridSize, logoBlockSize);
          const right = isDarkAt(matrix, x + 1, y, gridSize, logoBlockSize);

          neighbors = { top, bottom, left, right };

          if (dotType === "extraFluid") {
            neighbors = {
              ...neighbors,
              topLeft: isDarkAt(matrix, x - 1, y - 1, gridSize, logoBlockSize),
              topRight: isDarkAt(matrix, x + 1, y - 1, gridSize, logoBlockSize),
              bottomLeft: isDarkAt(matrix, x - 1, y + 1, gridSize, logoBlockSize),
              bottomRight: isDarkAt(matrix, x + 1, y + 1, gridSize, logoBlockSize),
            };
          }
        }

        elements.push(<Renderer key={`${x}-${y}`} x={x} y={y} size={size} neighbors={neighbors} color={bodyColor} />);
      }
    }

    return elements;
  }, [matrix, gridSize, dotType, logoBlockSize, bodyColor, size]);

  if (!gridSize) return null;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`-${padding} -${padding} ${totalSize} ${totalSize}`}
        className="relative z-10"
        style={{ maxWidth: "100%", maxHeight: "100%", backgroundColor: bgColor }}
        shapeRendering="geometricPrecision"
        xmlns="http://www.w3.org/2000/svg"
      >
        {dataPath}

        <FinderPattern x={0} y={0} frameType={eyeFrame} ballType={eyeBall} color={eyeColor} position="tl" />
        <FinderPattern x={gridSize - 7} y={0} frameType={eyeFrame} ballType={eyeBall} color={eyeColor} position="tr" />
        <FinderPattern x={0} y={gridSize - 7} frameType={eyeFrame} ballType={eyeBall} color={eyeColor} position="bl" />

        {logo && (
          <image
            href={logo}
            x={gridSize / 2 - logoBlockSize / 2}
            y={gridSize / 2 - logoBlockSize / 2}
            width={logoBlockSize}
            height={logoBlockSize}
            preserveAspectRatio="xMidYMid meet"
          />
        )}
      </svg>
    </div>
  );
};

export default React.memo(QRCodeRenderer);
