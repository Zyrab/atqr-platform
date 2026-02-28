"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useQR } from "@/context/qr-context";

import { resizeImageToBlob } from "@/lib/qr-utils";
import { QRData, QRContent } from "@/types/qr";
import { getLocale } from "@/content/getLocale";

import { Card } from "@/components/ui/card";
import AdSpace from "@/components/ui/ad-space";

import { HeaderGroup } from "@/components/elements/heading-group";
import RadioTexts from "@/components/elements/radio-text";
import EditorAccordion from "@/components/elements/accordion-editor";
import Icons from "@/components/elements/icons";

import Section from "@/components/layout/section";

import InputArea from "./input-area";
import UploadLogo from "./upload-logo";
import ShapesDesigner from "./shapes-designer";
import ColorsDesigner from "./colors-designer";
import Preview from "./preview-action";

type HeaderType = {
  header: {
    title?: string;
    subtitle?: string;
  };
  locale?: "en" | "ka";
};

type EditorCompKeys = "input-area" | "shapes-designer" | "upload-logo" | "colors-designer";

export default function Generator({ header, locale = "en" }: HeaderType) {
  const { user, userData } = useAuth();
  const { getQrById, qrCodes, updateQr, saveQr, loading } = useQR();
  const t = getLocale(locale, "generator");

  const isEditing = useRef<boolean>(false);
  const logoBlobRef = useRef<Blob | null>(null);
  const contentDrafts = useRef<Record<string, any>>({
    url: { type: "url", url: "" },
    text: { type: "text", text: "" },
    wifi: { type: "wifi", ssid: "", password: "", hidden: false },
  });
  const [qrData, setQrData] = useState<QRData>({
    name: "",
    content: { type: "url", url: "" },
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

  useEffect(() => {
    if (id) {
      const data = getQrById(id);
      if (data) setQrData(data);
      isEditing.current = true;
    }
  }, [id, getQrById]);

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

  const isFreeUser = userData?.plan === "free";
  const isTrialQrUsed = userData?.plan === "trial" ? qrCodes.filter((i) => i.type === "dynamic").length >= 1 : false;
  const qrLimit = userData?.qrLimit ?? 0;
  const qrCount = qrCodes.length;
  const hasReachedLimit = (user && isFreeUser && !isEditing.current && qrCount >= qrLimit) || false;
  const isDynamicAllowed = !isFreeUser && !isEditing.current && !isTrialQrUsed;

  const handleSaveQr = async () => {
    if (hasReachedLimit) {
      alert("Free plan limit reached. Upgrade to save more QR codes.");
      return;
    }
    if (isEditing.current && id) {
      updateQr(id, qrData, logoBlobRef.current);
    } else {
      await saveQr(qrData, logoBlobRef.current);
    }
  };

  const onTypeChange = (newType: QRContent["type"]) => {
    contentDrafts.current[qrData.content.type] = { ...qrData.content };

    setQrData((prev) => ({
      ...prev,
      content: { ...contentDrafts.current[newType] },
    }));
  };

  const editorComp = {
    "input-area": <InputArea qrData={qrData} setQrData={setQrData} dynamicAllowed={isDynamicAllowed} t={t.inputs} />,
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
          <Preview qrData={qrData} onSave={handleSaveQr} limitReached={hasReachedLimit} loading={loading} t={t} />
        </Card>
      </div>
      <p className="text-muted-foreground text-sm max-w-240 text-center">{t.footer}</p>
      <AdSpace />
    </Section>
  );
}
