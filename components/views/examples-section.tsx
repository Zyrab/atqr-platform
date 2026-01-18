import { HeaderGroup } from "@/components/elements/heading-group";
import { Card } from "@/components/ui/card";
import Section from "@/components/layout/section";

const examplesData = [
  {
    header: "Custom shapes",
    subheading: "Start with a free static QR code, upgrade only if you need more control.",
  },
  {
    header: "Brand colors",
    subheading: "Match your brand while keeping strong contrast for reliable scanning.",
  },
  {
    header: "Logo support",
    subheading: "Add your logo in the center, optional background removal included.",
  },
  {
    header: "Print-ready output",
    subheading: "Sharp, high-resolution QR codes suitable for print and digital use.",
  },
];

export default function ExamplesSection() {
  return (
    <Section bg="bg-muted">
      <HeaderGroup
        tag="h2"
        header="High-Quality QR Codes You Can Customize"
        subheading="A QR code should scan instantly and still look good when printed. Customize colors, shapes, and logos without breaking readability."
      />

      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-wrap gap-4 justify-center">
          {examplesData.map((item, index) => (
            <Card key={index} size="sm" width="xs">
              <HeaderGroup size="sm" tag="h3" header={item.header} subheading={item.subheading} />
            </Card>
          ))}
        </div>

        <p className="text-muted-foreground text-sm space-y-2 max-w-xl text-center">
          The generator prevents combinations that reduce scannability. All examples are static QR codes with no
          expiration.
        </p>
      </div>
    </Section>
  );
}
