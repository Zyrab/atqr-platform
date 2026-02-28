import { useDeferredValue, useRef, useState } from "react";
import QRCodeRenderer from "../../components/layout/renderer";
import RadioTexts from "@/components/elements/radio-text";
import Icons from "@/components/elements/icons";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

import { useQRCodeGenerator } from "@/hooks/use-qr-generator";
import { contentCheckers, resolveQRString } from "@/lib/content-utils";
import { useQRDownload } from "@/hooks/use-qr-download";

import { QRData } from "@/types/qr";
import { useAuth } from "@/context/auth-context";

interface PreviewProps {
  qrData: QRData;
  onSave: () => void;
  loading: boolean;
  limitReached: boolean;
  t: any;
}

const Preview = ({ qrData, onSave, loading, limitReached, t }: PreviewProps) => {
  const { user } = useAuth();

  const [downloadSize, setDownloadSize] = useState(1000);
  const [downloadFormat, setDownloadFormat] = useState<"png" | "jpeg" | "svg">("png");
  const svgRef = useRef<SVGSVGElement | null>(null);

  const qrValue = resolveQRString(qrData);
  const deferredValue = useDeferredValue(qrValue);
  const { matrix } = useQRCodeGenerator(deferredValue, Boolean(qrData.design.logo));
  const { downloadQrCode, isDownloading } = useQRDownload();
  const isContentFilled = contentCheckers[qrData.content.type](qrData.content);

  const handleDownload = () => {
    if (!isContentFilled) return;
    const fileName = qrData.name || "qr-code";
    downloadQrCode(svgRef, fileName, downloadFormat, downloadSize);
  };

  return (
    <>
      <div
        className="aspect-square flex relative overflow-hidden transition-colors duration-300"
        style={{ backgroundColor: qrData.design.bgColor === "transparent" ? "#fff" : qrData.design.bgColor }}
      >
        {!isContentFilled && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 z-10 backdrop-blur-[1px]">
            <span className="text-sm font-medium text-muted-foreground bg-background/80 px-3 py-1 rounded-full border shadow-sm">
              Enter {qrData.content.type} to preview
            </span>
          </div>
        )}

        <QRCodeRenderer matrix={matrix} svgRef={svgRef} size={500} design={qrData.design} />
      </div>
      <Slider
        value={[downloadSize]}
        onValueChange={(val: any) => setDownloadSize(val[0])}
        min={500}
        max={4000}
        minLabel="Low Q"
        maxLabel="High Q"
        step={100}
      />
      <RadioTexts values={["png", "jpeg", "svg"]} value={downloadFormat} onValueChange={setDownloadFormat} />
      <Button
        onClick={handleDownload}
        disabled={!isContentFilled || isDownloading || qrData.type === "dynamic"}
        variant="default"
      >
        {isDownloading ? <Icons name="loader_2" className="animate-spin" /> : <Icons name="download" />}
        {t.download.title}
      </Button>
      <div className="w-full flex flex-col gap-1">
        <Button size="lg" variant="outline" disabled={!isContentFilled || loading || limitReached} onClick={onSave}>
          {loading ? <Icons name="loader_2" className="animate-spin" /> : <Icons name="save" />}
          {user ? t.save.title : t.signin.title}
        </Button>
        <p className="text-muted-foreground text-xs max-w-240 text-center">
          {limitReached ? t.save.limit_reached : user ? t.save.note : t.signin.note}
        </p>
      </div>
    </>
  );
};

export default Preview;
