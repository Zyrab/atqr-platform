import { QRCodeMatrix } from "@/types/qr";

interface Neighbors {
  top: boolean | number;
  bottom: boolean | number;
  left: boolean | number;
  right: boolean | number;
  topLeft?: boolean | number;
  topRight?: boolean | number;
  bottomLeft?: boolean | number;
  bottomRight?: boolean | number;
}

interface ShapeProps {
  x: number;
  y: number;
  size: number;
  color: string;
  matrix?: QRCodeMatrix;
  neighbors?: Neighbors;
}
const G = 0.1; // Gap size
const O = 0.03; // Overlap size (to prevent seams)
const S = 1 - 2 * G;
const R = S / 2; // Radius for perfect circles

export const ShapeRenderers: Record<string, React.FC<ShapeProps>> = {
  square: ({ x, y, color }) => <rect x={x} y={y} width={1} height={1} fill={color} shapeRendering="crispEdges" />,
  softSquare: ({ x, y, color }) => <rect x={x} y={y} width={1} height={1} rx={0.18} ry={0.18} fill={color} />,
  circle: ({ x, y, color }) => <circle cx={x + 0.5} cy={y + 0.5} r={0.48} fill={color} />,
  dot: ({ x, y, color }) => <circle cx={x + 0.5} cy={y + 0.5} r={0.35} fill={color} />,
  diamond: ({ x, y, color }) => {
    const d = `M ${x + 0.5},${y + G} L ${x + 1 - G},${y + 0.5} L ${x + 0.5},${y + 1 - G} L ${x + G},${y + 0.5} Z`;
    return <path d={d} fill={color} />;
  },
  pill: ({ x, y, color, neighbors }) => {
    const { left, right } = neighbors || {};
    const rx = left || right ? 0.5 : 0.25;

    return <rect x={x} y={y} width={1} height={1} rx={rx} ry={0.5} fill={color} />;
  },
  blob: ({ x, y, color }) => <circle cx={x + 0.5} cy={y + 0.5} r={0.5} fill={color} />,
  fluid: ({ x, y, color, neighbors }) => {
    const { top, bottom, left, right } = neighbors || {};

    const tl = !top && !left ? R : 0;
    const tr = !top && !right ? R : 0;
    const bl = !bottom && !left ? R : 0;
    const br = !bottom && !right ? R : 0;

    const x0 = x - (left ? O : 0);
    const y0 = y - (top ? O : 0);
    const x1 = x + 1 + (right ? O : 0);
    const y1 = y + 1 + (bottom ? O : 0);

    let d = `M ${x0 + tl},${y0}`;

    d += ` L ${x1 - tr},${y0}`;
    if (tr) d += ` A ${tr},${tr} 0 0 1 ${x1},${y0 + tr}`;

    d += ` L ${x1},${y1 - br}`;
    if (br) d += ` A ${br},${br} 0 0 1 ${x1 - br},${y1}`;

    d += ` L ${x0 + bl},${y1}`;
    if (bl) d += ` A ${bl},${bl} 0 0 1 ${x0},${y1 - bl}`;

    d += ` L ${x0},${y0 + tl}`;
    if (tl) d += ` A ${tl},${tl} 0 0 1 ${x0 + tl},${y0}`;

    d += " Z";

    return <path d={d} fill={color} shapeRendering="geometricPrecision" />;
  },

  cutCorner: ({ x, y, color }) => (
    <path transform={`translate(${x},${y})`} d="M0.2 0 H1 V0.8 L0.8 1 H0 V0.2 Z" fill={color} />
  ),

  blobH: ({ x, y, color, neighbors }) => {
    const { left, right } = neighbors || {};

    const rL = left ? 0 : R;
    const rR = right ? 0 : R;

    const x0 = x + (left ? -O : G);
    const x1 = x + 1 + (right ? O : -G);

    const y0 = y + G;
    const y1 = y + 1 - G;

    const d = `
      M ${x0 + rL},${y0}
      H ${x1 - rR}
      A ${rR} ${rR} 0 0 1 ${x1},${y0 + rR}
      V ${y1 - rR}
      A ${rR} ${rR} 0 0 1 ${x1 - rR},${y1}
      H ${x0 + rL}
      A ${rL} ${rL} 0 0 1 ${x0},${y1 - rL}
      V ${y0 + rL}
      A ${rL} ${rL} 0 0 1 ${x0 + rL},${y0}
      Z
    `;

    return <path d={d} fill={color} shapeRendering="geometricPrecision" />;
  },

  blobV: ({ x, y, color, neighbors }) => {
    const { top, bottom } = neighbors || {};

    const rT = top ? 0 : R;
    const rB = bottom ? 0 : R;

    const x0 = x + G;
    const x1 = x + 1 - G;

    const y0 = y + (top ? -O : G);
    const y1 = y + 1 + (bottom ? O : -G);

    const d = `
      M ${x0 + rT},${y0}
      A ${rT} ${rT} 0 0 1 ${x1},${y0 + rT}
      V ${y1 - rB}
      A ${rB} ${rB} 0 0 1 ${x1 - rB},${y1}
      H ${x0 + rB}
      A ${rB} ${rB} 0 0 1 ${x0},${y1 - rB}
      V ${y0 + rT}
      A ${rT} ${rT} 0 0 1 ${x0 + rT},${y0}
      Z
    `;

    return <path d={d} fill={color} shapeRendering="geometricPrecision" />;
  },

  sharp: ({ x, y, color, neighbors }) => {
    const { top, bottom, left, right } = neighbors || {};
    const hvCount = [top, bottom, left, right].filter(Boolean).length;
    const x0 = x,
      y0 = y,
      x1 = x + 1,
      y1 = y + 1;
    const cx = x + 0.5,
      cy = y + 0.5;

    if (hvCount === 0) {
      return <path d={`M ${cx},${y0} L ${x1},${cy} L ${cx},${y1} L ${x0},${cy} Z`} fill={color} />;
    }

    if (hvCount === 1) {
      if (left) return <path d={`M ${x0 - O},${y0} L ${x0 - O},${y1} L ${x1},${cy} Z`} fill={color} />;
      if (right) return <path d={`M ${x1 + O},${y0} L ${x1 + O},${y1} L ${x0},${cy} Z`} fill={color} />;
      if (top) return <path d={`M ${x0},${y0 - O} L ${x1},${y0 - O} L ${cx},${y1} Z`} fill={color} />;
      if (bottom) return <path d={`M ${x0},${y1 + O} L ${x1},${y1 + O} L ${cx},${y0} Z`} fill={color} />;
    }

    const nx0 = left ? x0 - O : x0;
    const nx1 = right ? x1 + O : x1;
    const ny0 = top ? y0 - O : y0;
    const ny1 = bottom ? y1 + O : y1;

    return <path d={`M ${nx0},${ny0} H ${nx1} V ${ny1} H ${nx0} Z`} fill={color} shapeRendering="crispEdges" />;
  },
};

export const FrameRenderers: Record<string, React.FC<{ color: string }>> = {
  square: ({ color }) => <rect x={0.5} y={0.5} width={6} height={6} fill="none" stroke={color} strokeWidth={1} />,

  circle: ({ color }) => <circle cx={3.5} cy={3.5} r={3} fill="none" stroke={color} strokeWidth={1} />,

  soft: ({ color }) => (
    <rect x={0.5} y={0.5} width={6} height={6} rx={2.2} ry={2.2} fill="none" stroke={color} strokeWidth={1} />
  ),

  leaf: ({ color }) => (
    <path
      d="M6.5 6.5V2c0-.8-.7-1.5-1.5-1.5H.5v4.5c0 .8.7 1.5 1.5 1.5h4.5Z"
      fill="none"
      stroke={color}
      strokeWidth={1}
    />
  ),
  drop: ({ color }) => (
    <path
      d="M6.5 6.5V2c0-.8-.7-1.5-1.5-1.5h-3C1.3.5.5 1.3.5 2v3c0 .8.7 1.5 1.5 1.5h4.5Z"
      fill="none"
      stroke={color}
      strokeWidth={1}
    />
  ),
  eye: ({ color }) => (
    <path
      d="M6.5 6.5V2c0-.25-.48-.7-.75-.75L.5.5l.75 5.25c.05.31.45.75.75.75h4.5Z"
      fill="none"
      stroke={color}
      strokeWidth={1}
    />
  ),

  hex: ({ color }) => <path d="M6.5 6.5v-6h-4c-1.5 0-2 .5-2 2v4h6Z" fill="none" stroke={color} strokeWidth={1} />,
};

export const BallRenderers: Record<string, React.FC<{ color: string }>> = {
  square: ({ color }) => <rect x={2} y={2} width={3} height={3} fill={color} />,

  circle: ({ color }) => <circle cx={3.5} cy={3.5} r={1.5} fill={color} />,

  soft: ({ color }) => <rect x={2} y={2} width={3} height={3} rx={1.2} ry={1.2} fill={color} />,

  leaf: ({ color }) => <path d="M5 5V2.75C5 2.375 4.625 2 4.25 2H2v2.25c0 .375.375.75.75.75H5Z" fill={color} />,

  drop: ({ color }) => (
    <path d="M5 5V2.75C5 2.375 4.625 2 4.25 2h-1.5c-.375 0-.75.375-.75.75v1.5c0 .375.375.75.75.75H5Z" fill={color} />
  ),
  eye: ({ color }) => (
    <path d="M5 5V2.75c0-.125-.24-.35-.375-.375L2 2l.375 2.625C2.4 4.78 2.6 5 2.75 5H5Z" fill={color} />
  ),

  hex: ({ color }) => <path d="M5 5V2H3c-.75 0-1 .25-1 1v2h3Z" fill={color} />,
};
const FINDER_ROTATION: Record<"tl" | "tr" | "bl", number> = {
  tl: 0,
  tr: 90,
  bl: -90,
};

export const FinderPattern = ({
  x,
  y,
  frameType,
  ballType,
  color,
  position,
}: {
  x: number;
  y: number;
  frameType: string;
  ballType: string;
  color: string;
  position: "tl" | "tr" | "bl";
}) => {
  const Frame = FrameRenderers[frameType] || FrameRenderers.square;
  const Ball = BallRenderers[ballType] || BallRenderers.square;
  const rot = FINDER_ROTATION[position];

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rot}, 3.5, 3.5)`}>
      <Frame color={color} />
      <Ball color={color} />
    </g>
  );
};
