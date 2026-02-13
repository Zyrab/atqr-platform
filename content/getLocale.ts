import { landing as enLanding } from "./en/landing";
import { landing as kaLanding } from "./ka/landing";

import { generator as enGenerator } from "./en/generator";
import { generator as kaGenerator } from "./ka/generator";

import { dashboard as enDashboard } from "./en/dashboard";
import { dashboard as kaDashboard } from "./ka/dashboard";

import { header as enHeader } from "./en/header";
import { header as kaHeader } from "./ka/header";

import { pricing as enPricing } from "./en/pricing";

const en = {
  landing: enLanding,
  generator: enGenerator,
  dashboard:enDashboard,
  header:enHeader,
  pricing:enPricing
}
type TranslationSchema = typeof en;

const ka: TranslationSchema = {
  landing: kaLanding,
  generator: kaGenerator,
  dashboard:kaDashboard,
  header:kaHeader,
  pricing:enPricing
};

const translations: Record<Locale, TranslationSchema> = { en, ka };

export type Locale = "en" | "ka";
export type Page = keyof TranslationSchema;

export function getLocale<P extends Page>(locale: Locale, page: P): TranslationSchema[P] {
  return translations[locale][page];
}