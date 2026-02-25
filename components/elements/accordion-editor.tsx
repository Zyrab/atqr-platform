"use client";

import * as React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export type EditorPanelItem = {
  id: string;
  title: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
};

interface EditorAccordionProps {
  items: EditorPanelItem[];
  defaultValue?: string;
  className?: string;
}

export default function EditorAccordion({ items, defaultValue, className }: EditorAccordionProps) {
  return (
    <Accordion
      type="single"
      collapsible={false}
      defaultValue={defaultValue}
      className={cn("w-full flex flex-col gap-4", className)}
    >
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id} className="overflow-hidden bg-background">
          <AccordionTrigger className="px-4 py-3 text-lg font-bold hover:bg-muted/20 hover:no-underline transition-colors">
            <div className="flex items-center gap-2">
              {item.icon}
              {item.title}
            </div>
          </AccordionTrigger>
          <AccordionContent className="py-4 bg-card">{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
