"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import Section from "@/components/layout/section";
import Generator from "./generator/page";
import { HeaderGroup } from "@/components/elements/heading-group";
import { Button } from "@/components/ui/button";
import PricingSection from "@/components/views/pricing-section";
import ExamplesSection from "@/components/views/examples-section";
import { getLocale } from "@/content/getLocale";
import { ActionKey, actions } from "@/lib/actions";
import AccordionGroup from "@/components/elements/accordion-group";
import Image from "next/image";
import WhatIsQR from "@/components/views/what-is-qr";
import StaticVsDinamicSection from "@/components/views/static-vs-dicamic";
import WhenDinmic from "@/components/views/when-dinamic";
export default function Landing({ locale = "en" }: { locale?: "en" | "ka" }) {
  const generatorRef = useRef<HTMLDivElement>(null);
  const t = getLocale(locale, "landing");
  const router = useRouter();

  const handleAction = (action: ActionKey) => {
    actions[action]?.({
      generatorRef,
      router,
    });
  };
  return (
    <>
      <div ref={generatorRef}>
        <Generator header={t.title} />
      </div>
      <WhatIsQR data={t.whatIsQr} />
      <StaticVsDinamicSection t={t.staticVsDynamic} />
      <Section>
        <HeaderGroup header={t.unsure.title} subheading={t.unsure.subtitle} />
        <Button onClick={() => handleAction(t.unsure.button.action as ActionKey)} size="lg">
          {t.unsure.button.label}
        </Button>
      </Section>
      <ExamplesSection t={t.examples} />
      <PricingSection t={t.pricing} onAction={handleAction} />
      <WhenDinmic t={t.usefullness} />
      <Section>
        <HeaderGroup header={t.faq.title} />
        <AccordionGroup items={t.faq.content} />
      </Section>
      <Section>
        <HeaderGroup header={t.why.title} subheading={t.why.subtitle} />
        <div className="max-w-xl w-full relative aspect-video">
          <Image
            src={`/images/${t.why.img}.webp`}
            alt={t.why.title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 600px"
          />
        </div>
        <p className="text-foreground text-md space-y-2 max-w-240 text-center">{t.why.notice}</p>
      </Section>
    </>
  );
}
