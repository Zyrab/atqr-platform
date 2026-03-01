import { QRContent, QRDocument } from "@/types/qr";
import { Badge } from "@/components/ui/badge";
import Icons from "@/components/elements/icons";

type ContentBadgeProps = {
  doc: QRDocument;
  qrValue: string | null;
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const truncate = (val: any) => {
  if (!val) return "";
  const str = String(val);
  return str.length <= 25 ? str : str.slice(0, 25) + "…";
};

export const ContentBadge = ({ doc, qrValue }: ContentBadgeProps) => {
  const activeFields = BADGE_FIELDS[doc.content.type] || [];
  const isDynamic = doc.type === "dynamic" && doc.content.type === "url";
  const formattedDate = dateFormatter.format(new Date(doc.createdAt));

  return (
    <>
      {isDynamic && (
        <Badge variant="ghost">
          <Icons name="link_2" />
          {truncate(qrValue)}
        </Badge>
      )}
      {activeFields.map(({ icon, key }) => (
        <Badge key={key} variant="ghost">
          <Icons name={icon} />
          {truncate((doc.content as any)[key])}
        </Badge>
      ))}
      <Badge variant="ghost">
        <Icons name="calendar" />
        {formattedDate}
      </Badge>
    </>
  );
};

interface FieldConfig {
  key: string;
  icon: string;
}
export const BADGE_FIELDS: Record<QRContent["type"], FieldConfig[]> = {
  url: [{ key: "url", icon: "corner_down_right" }],
  text: [{ key: "text", icon: "text" }],
  wifi: [
    { key: "ssid", icon: "wifi" },
    { key: "password", icon: "key_round" },
  ],
};
