"use client";
import { useState } from "react";
import { HeaderGroup } from "@/components/elements/heading-group";
import Section from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLocale } from "@/content/getLocale";
import { ActionKey, actions } from "@/lib/actions";
import { CircleCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import AccordionGroup from "@/components/elements/accordion-group";

type PricingItem = {
  title: string;
  items: string[];
  button: {
    label: string;
    action: string; // keep as string for translation; cast in component
  };
};

export default function Pricing({ locale = "en" }: { locale?: "en" | "ka" }) {
  const { title, subtitle, faq, footer, content, unsure } = getLocale(locale, "pricing");
  const [loading, setLoading] = useState<Partial<Record<ActionKey, boolean>>>({});
  const router = useRouter();

  const handleAction = (action: ActionKey) => {
    actions[action]?.({
      router,
      setLoading: (isLoading: boolean) => setLoading((prev) => ({ ...prev, [action]: isLoading })),
    });
  };

  return (
    <>
      <Section>
        <HeaderGroup tag="h1" header={title} subheading={subtitle} />
        <div className="flex flex-col justify-center md:flex-row gap-6 w-full">
          {content.map(({ title, items, button }: PricingItem, i: number) => {
            const key = button.action as ActionKey;
            const isLoading = !!loading[key];

            return (
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
                <Button size="sm" variant="default" disabled={isLoading} onClick={() => handleAction(key)}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? "Loading..." : button.label}
                </Button>
              </Card>
            );
          })}
        </div>
        <p className="text-foreground text-md space-y-2 max-w-240 text-center">{footer}</p>
      </Section>
      <Section>
        <HeaderGroup header={faq.title} />
        <AccordionGroup items={faq.content} />
      </Section>
      <Section>
        <HeaderGroup header={unsure.title} subheading={unsure.subtitle} />
        <Button onClick={() => handleAction(unsure.button.action as ActionKey)} size="lg">
          {unsure.button.label}
        </Button>
      </Section>
    </>
  );
}
