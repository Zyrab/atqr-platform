"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSafeAction } from "@/hooks/use-safe-action";

import { getLocale } from "@/content/getLocale";
import { ActionKey, actions } from "@/lib/actions";

import Section from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HeaderGroup } from "@/components/elements/heading-group";
import AccordionGroup from "@/components/elements/accordion-group";
import Icons from "@/components/elements/icons";

type PricingItem = {
  title: string;
  items: string[];
  button: {
    label: string;
    action: string;
  };
};

export default function Pricing({ locale = "en" }: { locale?: "en" | "ka" }) {
  const { title, subtitle, faq, footer, content, unsure } = getLocale(locale, "pricing");
  const { runAction, loading } = useSafeAction();
  const [activeKey, setActiveKey] = useState<ActionKey | null>(null);
  const router = useRouter();

  const handleAction = async (key: ActionKey) => {
    const actionFn = actions[key];
    if (!actionFn) return;

    setActiveKey(key);

    await runAction(async () => actionFn({ router }), {
      requireAuth: true,
      onSuccess: () => {
        if (key === "start_trial") router.push("/generator");
      },
    });

    setActiveKey(null);
  };
  return (
    <>
      <Section>
        <HeaderGroup tag="h1" header={title} subheading={subtitle} />
        <div className="flex flex-col justify-center md:flex-row gap-6 w-full">
          {content.map(({ title, items, button }: PricingItem, i: number) => {
            const key = button.action as ActionKey;
            const isLoading = loading && activeKey === key;

            return (
              <Card key={i} width="xs" size="sm">
                <HeaderGroup tag="h3" size="sm" header={title} />
                <ul className="w-full h-full">
                  {items.map((item: string) => (
                    <li key={item} className="flex gap-1 items-center mt-1">
                      <Icons name="circle_check" color="#5CE639" size={16} />
                      <p className="text-foreground-muted text-sm">{item}</p>
                    </li>
                  ))}
                </ul>
                <Button size="sm" variant="default" disabled={isLoading} onClick={() => handleAction(key)}>
                  {isLoading && <Icons name="loader_2" className="animate-spin" />}
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
