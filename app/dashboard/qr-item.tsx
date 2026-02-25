"use client";

import { useState, useRef, useMemo } from "react";
import {
  Download,
  Edit,
  Trash2,
  Copy,
  Calendar,
  Loader2,
  Link2,
  Check,
  X,
  CornerDownRight,
  Palette,
  ChartLine,
  Type,
  Wifi,
  Text,
} from "lucide-react";

// UI Components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { HeaderGroup } from "@/components/elements/heading-group";
import { Input } from "@/components/ui/input";
import RadioTexts from "@/components/elements/radio-text";

// Logic & Types
import QRCodeRenderer from "../generator/renderer";
import { useQRDownload } from "@/hooks/use-qr-download";
import { useQR } from "@/context/qr-context";
import { useQRCodeGenerator } from "@/hooks/use-qr-generator";
import { QRContent, QRDocument } from "@/types/qr";
import { contentCheckers, resolveQRString } from "@/lib/content-utils";

interface DashboardItemProps {
  item: QRDocument;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (item: QRDocument) => void;
  t: any;
}
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

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

  const formattedDate = useMemo(() => {
    return dateFormatter.format(new Date(item.createdAt));
  }, [item.createdAt]);

  function renderContentBadges(item: QRDocument) {
    const content = item.content;
    if (item.type === "dynamic" && content.type === "url")
      return (
        <>
          <Badge variant="ghost">
            <Link2 />
            {qrValue?.slice(0, 25) + "…"}
          </Badge>
          <Badge variant="ghost">
            <CornerDownRight />
            {content.url.slice(0, 25) + "…"}
          </Badge>
        </>
      );
    switch (content.type) {
      case "url":
        return (
          <Badge variant="ghost">
            <CornerDownRight />
            {content.url.slice(0, 25) + "…"}
          </Badge>
        );
      case "text":
        return (
          <Badge variant="ghost">
            <Text />
            {content.text.slice(0, 25) + "…"}
          </Badge>
        );
      case "wifi":
        return (
          <Badge variant="ghost">
            <Wifi />
            SSID: {content.ssid || "—"}, Password: {content.password || "—"}
          </Badge>
        );
      default:
        return null;
    }
  }

  const typeIcon = {
    url: <Link2 />,
    text: <Type />,
    wifi: <Wifi />,
    dynamic: <Link2 />,
  };

  return (
    <Card width="auto" size="sm" className="gap-8 md:flex-row md:justify-between">
      {/* 1. Visual Preview Area */}
      <div className="gap-8 flex flex-row">
        <div className="flex flex-col gap-2 md:flex-row md:gap-5">
          <div className="w-30 h-30 transition-transform duration-300 group-hover:scale-105">
            <QRCodeRenderer matrix={matrix} svgRef={svgRef} size={200} design={item.design} />
          </div>
          <div className="flex flex-row md:flex-col  md:pt-2 justify-between md:justify-start gap-3">
            <Badge variant="secondary" className="md:w-full">
              {typeIcon[item.content.type]}
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
                <Edit />
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
                <Check />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setNameDraft(item.name); // reset
                  setIsEditName(false);
                }}
              >
                <X />
              </Button>
            </div>
          )}
          {renderContentBadges(item)}
          <Badge variant="ghost">
            <Calendar />
            {formattedDate}
          </Badge>
        </div>
      </div>
      <div className="gap-8 flex flex-col md:flex-row">
        <div className="flex flex-col justify-between">
          <div className="flex flex-row gap-0.5 justify-between">
            <Button variant="ghost" size="lg" onClick={() => onEdit(item.id)}>
              <Palette />
            </Button>
            {isDynamic && (
              <Button variant="ghost" size="lg">
                <ChartLine />
              </Button>
            )}
            <Button variant="ghost" size="lg" onClick={() => onDuplicate(item)}>
              <Copy />
            </Button>
            <Button variant="ghost" size="lg" onClick={() => onDelete(item.id)}>
              <Trash2 color="#C9404A" />
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
            {isDownloading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Download className="w-4 h-4 mr-2" />}
            {t.action.label}
          </Button>
        </div>
      </div>
    </Card>
  );
}
