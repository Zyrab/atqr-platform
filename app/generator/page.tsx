"use client";

import { useState, useRef, useEffect, useMemo, useDeferredValue } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { HeaderGroup } from "@/components/elements/heading-group";
import Section from "@/components/layout/section";
import InputArea from "./input-area";
import UploadLogo from "./upload-logo";
import QRCodeRenderer from "./renderer";
import AdSpace from "@/components/ui/ad-space";

import { resizeImageToBlob } from "@/lib/qr-utils";
import { useQRCodeGenerator } from "@/hooks/use-qr-generator";
import { useQRDownload } from "@/hooks/use-qr-download";
import { useQR } from "@/context/qr-context";
import { QRData, QRContent } from "@/types/qr";
import { getLocale } from "@/content/getLocale";
import RadioTexts from "@/components/elements/radio-text";
import { CheckboxLabel } from "@/components/ui/input";
import { contentCheckers, resolveQRString } from "@/lib/content-utils";
import EditorAccordion from "@/components/elements/accordion-editor";
import Icons from "@/components/elements/icons";
import ShapesDesigner from "./shapes-designer";
import ColorsDesigner from "./colors-designer";

type HeaderType = {
  header: {
    title?: string;
    subtitle?: string;
  };
  locale?: "en" | "ka";
};
type EditorCompKeys = "input-area" | "shapes-designer" | "upload-logo" | "colors-designer";
const DEFAULT_CONTENT: Record<QRContent["type"], QRContent> = {
  url: { type: "url", url: "" },
  text: { type: "text", text: "" },
  wifi: { type: "wifi", ssid: "", password: "", hidden: false },
};

export default function Generator({ header, locale = "en" }: HeaderType) {
  const { user, userData } = useAuth();
  const t = getLocale(locale, "generator");
  const [downloadSize, setDownloadSize] = useState(1000);
  const [downloadFormat, setDownloadFormat] = useState<"png" | "jpeg" | "svg">("png");
  const isEditing = useRef<boolean>(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const logoBlobRef = useRef<Blob | null>(null);
  const [qrData, setQrData] = useState<QRData>({
    name: "",
    content: {
      type: "url",
      url: "",
    },
    design: {
      dotType: "square",
      bodyColor: "#000000",
      bgColor: "#ffffff",
      logo: null,
      logoBG: false,
      logoStyle: "square",
      eyeFrame: "square",
      eyeBall: "square",
    },
    type: "static",
  });

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { getQrById, qrCodes, updateQr, saveQr, loading } = useQR();

  useEffect(() => {
    if (id) {
      const data = getQrById(id);
      if (data) setQrData(data);
      isEditing.current = true;
    }
  }, [id, getQrById]);

  const qrValue = resolveQRString(qrData);
  const deferredValue = useDeferredValue(qrValue);
  const { matrix } = useQRCodeGenerator(deferredValue, Boolean(qrData.design.logo));
  const { downloadQrCode, isDownloading } = useQRDownload();

  const handleDownload = () => {
    if (!isContentFilled) return;
    const fileName = qrData.name || "qr-code";
    downloadQrCode(svgRef, fileName, downloadFormat, downloadSize);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const blob = await resizeImageToBlob(file);
        logoBlobRef.current = blob;

        setQrData((prev) => ({
          ...prev,
          design: { ...prev.design, logo: URL.createObjectURL(blob) },
        }));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const onDesignChange = (key: keyof QRData["design"], value: any) =>
    setQrData((prev) => ({ ...prev, design: { ...prev.design, [key]: value } }));

  const isContentFilled = contentCheckers[qrData.content.type](qrData.content);

  const isFreeUser = userData?.plan === "free";
  const isTrialQrUsed = userData?.plan === "trial" ? qrCodes.filter((i) => i.type === "dynamic").length >= 1 : false;
  const qrLimit = userData?.qrLimit ?? 0;
  const qrCount = qrCodes.length;
  const hasReachedLimit = (user && isFreeUser && !isEditing.current && qrCount >= qrLimit) || false;

  const handleSaveQr = async () => {
    if (hasReachedLimit) {
      alert("Free plan limit reached. Upgrade to save more QR codes.");
      return;
    }
    if (isEditing.current) {
      if (id) await updateQr(id, qrData, logoBlobRef.current);
    } else {
      await saveQr(qrData, logoBlobRef.current);
    }
  };

  const onTypeChange = (type: QRContent["type"]) => {
    setQrData((prev) => ({ ...prev, content: DEFAULT_CONTENT[type] }));
  };

  const editorComp = {
    "input-area": <InputArea qrData={qrData} setQrData={setQrData} t={t.inputs} />,
    "shapes-designer": <ShapesDesigner design={qrData.design} onDesignChange={onDesignChange} t={t.designer} />,
    "colors-designer": <ColorsDesigner design={qrData.design} onDesignChange={onDesignChange} t={t.designer} />,
    "upload-logo": <UploadLogo design={qrData.design} setQrData={setQrData} upload={handleImageUpload} t={t.logo} />,
  };

  const editorPanel = t.editor_panel.map((p) => ({
    ...p,
    icon: <Icons name={p.icon} size={18} />,
    content: editorComp[p.comp as EditorCompKeys],
  }));
  return (
    <Section>
      {header ? <HeaderGroup tag="h1" header={header.title} subheading={header.subtitle} /> : null}
      <div className="w-full max-w-6xl  grid grid-cols-1 gap-4  md:grid-cols-3">
        {!isEditing.current && (
          <Card size="none" width="auto" className="md:col-span-3">
            <RadioTexts values={["url", "text", "wifi"]} value={qrData.content.type} onValueChange={onTypeChange} />
          </Card>
        )}
        <Card width="auto" size="sm" className="order-2 md:order-1 md:col-span-2">
          <EditorAccordion items={editorPanel} defaultValue="content-area" />
          <p className="font-bold text-sm mt-auto">{t.title}</p>
        </Card>
        <Card width="auto" className="order-1 md:order-2 md:col-span-1">
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

          <div className="w-full flex flex-col gap-1">
            <Button
              onClick={handleDownload}
              disabled={!isContentFilled || isDownloading || qrData.type === "dynamic"}
              variant="default"
            >
              {isDownloading ? <Icons name="loader_2" className="animate-spin" /> : <Icons name="download" />}
              {t.download.title}
            </Button>
            <p className="text-muted-foreground text-xs max-w-240 text-center">{t.download.note}</p>
          </div>
          <div className="w-full flex flex-col gap-1">
            <Button
              size="lg"
              variant="outline"
              disabled={!isContentFilled || loading || hasReachedLimit}
              onClick={handleSaveQr}
            >
              {loading ? <Icons name="loader_2" className="animate-spin" /> : <Icons name="save" />}
              {user ? t.save.title : t.signin.title}
            </Button>
            <p className="text-muted-foreground text-xs max-w-240 text-center">
              {hasReachedLimit ? t.save.limit_reached : user ? t.save.note : t.signin.note}
            </p>
          </div>
          {!isFreeUser && !isEditing.current && !isTrialQrUsed && (
            <CheckboxLabel
              label="Track Scans"
              id="qr-type"
              disabled={qrData.content.type !== "url"}
              checked={qrData.type === "dynamic"}
              onCheckedChange={(val) => setQrData((prev) => ({ ...prev, type: val ? "dynamic" : "static" }))}
            />
          )}
        </Card>
      </div>
      <p className="text-muted-foreground text-sm max-w-240 text-center">{t.footer}</p>
      <AdSpace />
    </Section>
  );
}
