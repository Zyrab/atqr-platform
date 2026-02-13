import { CircleCheck } from "lucide-react";
import { HeaderGroup } from "../elements/heading-group";
import Section from "../layout/section";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ActionKey } from "@/lib/actions";

type PricingProps = {
  t: any;
  onAction: (action: ActionKey) => void;
};

export default function PricingSection({ t, onAction }: PricingProps) {
  const { title, subtitle, content, footer } = t;
  return (
    <Section>
      <HeaderGroup tag="h2" header={title} subheading={subtitle} />
      <div className="flex flex-col justify-center md:flex-row gap-6 w-full">
        {content.map(({ title, items, button }: any, i: number) => (
          <Card key={i} width="xs" size="sm">
            <HeaderGroup tag="h3" size="sm" header={title} />
            <ul className="w-full h-full">
              {items.map((item: string) => (
                <li key={item} className="flex gap-1 items-center mt-1">
                  <CircleCheck color="#5CE639" size={16} />
                  <p className="text-foreground-muted text-sm">{item}</p>
                </li>
              ))}
            </ul>
            <Button size="sm" variant="default" onClick={() => onAction(button.action)}>
              {button.label}
            </Button>
          </Card>
        ))}
      </div>
      <p className="text-foreground text-md space-y-2 max-w-240 text-center">{footer}</p>
    </Section>
  );
}
