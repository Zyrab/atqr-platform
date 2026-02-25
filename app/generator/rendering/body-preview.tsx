import { ShapeRenderers, FrameRenderers, BallRenderers } from "./shape-renderers";
export const PREVIEW_MATRIX = [
  [1, 0, 1, 0, 1],
  [1, 1, 1, 0, 0],
  [0, 0, 1, 0, 1],
  [0, 1, 1, 1, 1],
  [1, 0, 1, 0, 1],
];

export function BodyPreview({ type }: { type: string }) {
  const matrix = PREVIEW_MATRIX;
  const size = matrix.length;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      shapeRendering="geometricPrecision"
      vectorEffect="non-scaling-stroke"
      className="w-full h-full text-foreground"
    >
      {matrix.map((row, y) =>
        row.map((val, x) => {
          if (!val) return null;
          const neighbors = {
            top: matrix[y - 1]?.[x],
            bottom: matrix[y + 1]?.[x],
            left: matrix[y]?.[x - 1],
            right: matrix[y]?.[x + 1],
          };
          const Renderer = ShapeRenderers[type] || ShapeRenderers.square;
          return <Renderer key={`${x}-${y}`} x={x} y={y} size={10} color={"currentColor"} neighbors={neighbors} />;
        }),
      )}
    </svg>
  );
}

// Helper to render previews for Eye Frame
export function FramePreview({ type }: { type: string }) {
  const Frame = FrameRenderers[type] || FrameRenderers.square;
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 7 7"
      className="w-full h-full p-1 text-foreground"
    >
      <Frame color={"currentColor"} />
    </svg>
  );
}

// Helper to render previews for Eye Ball
export function BallPreview({ type }: { type: string }) {
  const Ball = BallRenderers[type] || BallRenderers.square;
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 7 7"
      className="w-full h-full p-1 text-foreground scale-200"
    >
      <Ball color={"currentColor"} />
    </svg>
  );
}

export function ColorPreview({ color }: { color: string }) {
  return (
    <svg
      className="w-full text-foreground"
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 25 25"
    >
      <path d="M25,12.5 A12.5,12.5 0 1 0 0,12.5 A12.5,12.5 0 1 0 25,12.5 Z" fill={color ? color : "currentColor"} />
    </svg>
  );
}
