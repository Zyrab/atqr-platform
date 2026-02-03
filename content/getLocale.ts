import { landing as enLanding } from "./en/landing";
import { landing as kaLanding } from "./en/landing";
import { generator as enGenerator } from "./en/generator";
import { generator as kaGenerator } from "./ka/generator";
import { dashboard as enDashboard } from "./en/dashboard";

const en = {
  landing: enLanding,
  generator: enGenerator,
  dashboard:enDashboard,
}
type TranslationSchema = typeof en;

const ka: TranslationSchema = {
  landing: kaLanding,
  generator: kaGenerator,
  dashboard:enDashboard,
};

const translations: Record<Locale, TranslationSchema> = { en, ka };

export type Locale = "en" | "ka";
export type Page = keyof TranslationSchema;

export function getLocale<P extends Page>(locale: Locale, page: P): TranslationSchema[P] {
  return translations[locale][page];
}