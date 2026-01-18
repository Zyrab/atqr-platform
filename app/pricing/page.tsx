import { HeaderGroup } from "@/components/elements/heading-group";
import Section from "@/components/layout/section";

export default function Pricing({ landing = false }) {
  return (
    <Section>
      <HeaderGroup tag={landing ? "h2" : "h1"} header />
    </Section>
  );
}
