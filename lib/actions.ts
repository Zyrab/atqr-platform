import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { services } from "./firebase/services";
import type React from "react";

export type ActionContext = {
  generatorRef?: React.RefObject<HTMLDivElement | null>;
  router?: AppRouterInstance;
};

type ActionFn = (ctx: ActionContext) => Promise<any> | void;

export const actions:Record<string, ActionFn> = {
  scroll_to_generator: ({ generatorRef }: ActionContext) => {
    generatorRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  },
  go_to_login: ({ router }: ActionContext) => router?.push("/auth?mode=login"),
  go_to_generator: ({ router }: ActionContext) => router?.push("/generator"),
  go_to_pricing: ({ router }: ActionContext) => router?.push("/pricing"),
  start_trial:services.stripe.startTrial,
  get_monthly_pro: services.stripe.checkout,
  manage_subscription: services.stripe.portal,
} as const;

export type ActionKey = keyof typeof actions;
