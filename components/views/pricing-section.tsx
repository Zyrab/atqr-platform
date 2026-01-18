import { CircleCheck } from "lucide-react";
import { HeaderGroup } from "../elements/heading-group";
import Section from "../layout/section";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

export default function PricingSection() {
  return (
    <Section>
      <HeaderGroup
        tag="h2"
        header="Free and Paid. What’s Included"
        subheading="You can generate and download static QR codes for free. Create an account only if you want to save or manage them."
      />
      <div className="flex flex-col justify-center md:flex-row gap-6 w-full">
        {pricingData.map(({ header, content, button }, i) => (
          <Card key={i} width="xs" size="sm">
            <HeaderGroup tag="h3" size="sm" header={header} />
            <ul className="w-full h-full">
              {content.map((item) => (
                <li key={item} className="flex gap-1 items-center mt-1">
                  <CircleCheck color="#5CE639" size={20} />
                  <p className="text-foreground-muted text-sm">{item}</p>
                </li>
              ))}
            </ul>
            <Button size="sm" variant="outline">
              {button}
            </Button>
          </Card>
        ))}
      </div>
      <p className="text-foreground text-md space-y-2 max-w-240 text-center">
        Static QR codes are best for most printed use cases. Dynamic QR codes are only needed when the destination must
        change after printing.
      </p>
    </Section>
  );
}

const pricingData = [
  {
    header: "Free (No account required)",
    content: [
      "Generate unlimited static QR codes",
      "Download instantly",
      "No expiration",
      "No tracking",
      "Not saved on the server",
    ],
    button: "Generate free QR code",
  },
  {
    header: "Free account",
    content: ["Save up to 10 static QR codes", "Access them from any device", "Edit design (URL stays the same)"],
    button: "Create free account",
  },
  {
    header: "From $X / month",
    content: [
      "Change destination link anytime",
      "Central management dashboard",
      "Designed for campaigns and updates",
      "Requires an active plan",
    ],
    button: "Get dynamic QR codes",
  },
];
