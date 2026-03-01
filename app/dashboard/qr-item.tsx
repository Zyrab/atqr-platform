"use client";

import { useState, useRef } from "react";

// UI Components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { HeaderGroup } from "@/components/elements/heading-group";
import { Input } from "@/components/ui/input";
import RadioTexts from "@/components/elements/radio-text";
import QRCodeRenderer from "../../components/layout/renderer";

// Logic & Types
import { useQRDownload } from "@/hooks/use-qr-download";
import { useQR } from "@/context/qr-context";
import { useQRCodeGenerator } from "@/hooks/use-qr-generator";
import { QRContent, QRDocument } from "@/types/qr";
import { contentCheckers, resolveQRString } from "@/lib/content-utils";
import Icons from "@/components/elements/icons";
import { ContentBadge } from "./content-badge";

interface DashboardItemProps {
  item: QRDocument;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (item: QRDocument) => void;
  t: any;
}

export default function DashboardItem({ item, onEdit, onDelete, onDuplicate, t }: DashboardItemProps) {
  const [downloadSize, setDownloadSize] = useState(1000);
  const [downloadFormat, setDownloadFormat] = useState<"png" | "jpeg" | "svg">("png");

  const [isEditName, setIsEditName] = useState<boolean>(false);
  const [nameDraft, setNameDraft] = useState(item.name);

  const { updateQr } = useQR();

  const isDynamic = item.type === "dynamic";

  const svgRef = useRef<SVGSVGElement | null>(null);
  const { downloadQrCode, isDownloading } = useQRDownload();

  const isContentFilled = contentCheckers[item.content.type](item.content);

  const qrValue = resolveQRString(item);
  const { matrix } = useQRCodeGenerator(qrValue, Boolean(item.design.logo));

  const handleDownload = () => {
    if (!isContentFilled) return;
    const fileName = item.name || "qr-code";
    downloadQrCode(svgRef, fileName, downloadFormat, downloadSize);
  };

  return (
    <Card width="auto" size="sm" className="gap-8 md:flex-row md:justify-between">
      <div className="gap-8 flex flex-row">
        <div className="flex flex-col gap-2 md:flex-row md:gap-5">
          <div className="w-35 h-35 transition-transform duration-300 group-hover:scale-105">
            <QRCodeRenderer matrix={matrix} svgRef={svgRef} size={200} design={item.design} />
          </div>
          <div className="flex flex-row md:flex-col  md:pt-2 justify-between md:justify-start gap-3">
            <Badge variant="secondary" className="md:w-full">
              <Icons name={item.content.type} />
              {item.content.type.toUpperCase()}
            </Badge>

            {isDynamic ? (
              <Badge>Dynamic</Badge>
            ) : (
              <Badge variant="secondary" className="md:w-full">
                Static
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between">
          {!isEditName ? (
            <HeaderGroup tag="h3" header={item.name || "Untitled QR"} className="flex-row items-start">
              <Button variant="ghost" onClick={() => setIsEditName(true)}>
                <Icons name="edit" />
              </Button>
            </HeaderGroup>
          ) : (
            <div className="flex flex-row gap-0.5">
              <Input type="text" value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} autoFocus />

              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  updateQr(item.id, { name: nameDraft }, null);
                  setIsEditName(false);
                }}
              >
                <Icons name="check" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setNameDraft(item.name);
                  setIsEditName(false);
                }}
              >
                <Icons name="x" />
              </Button>
            </div>
          )}
          <ContentBadge doc={item} qrValue={qrValue} />
        </div>
      </div>
      <div className="gap-8 flex flex-col md:flex-row">
        <div className="flex flex-col justify-between">
          <div className="flex flex-row gap-0.5 justify-between">
            <Button variant="ghost" size="lg" onClick={() => onEdit(item.id)}>
              <Icons name="palette" />
            </Button>
            {isDynamic && (
              <Button variant="ghost" size="lg">
                <Icons name="chartLine" />
              </Button>
            )}
            <Button variant="ghost" size="lg" onClick={() => onDuplicate(item)}>
              <Icons name="copy" />
            </Button>
            <Button variant="ghost" size="lg" onClick={() => onDelete(item.id)}>
              <Icons name="trash_2" color="#C9404A" />
            </Button>
          </div>
          <RadioTexts values={["png", "jpeg", "svg"]} value={downloadFormat} onValueChange={setDownloadFormat} />
        </div>
        <div className="flex flex-col justify-between gap-8">
          <Slider
            value={[downloadSize]}
            onValueChange={(val: any) => setDownloadSize(val[0])}
            min={500}
            max={4000}
            minLabel="Low Q"
            maxLabel="High Q"
            step={100}
            className="w-full"
          />
          <Button onClick={handleDownload} disabled={isDownloading} size="lg">
            {isDownloading ? <Icons name="loader_2" className="animate-spin" /> : <Icons name="download" />}
            {t.action.label}
          </Button>
        </div>
      </div>
    </Card>
  );
}
