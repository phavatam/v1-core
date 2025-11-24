import { lazy } from "react";

export const LoginLayout = lazy(() =>
  import("../components/features/auth").then((module) => ({
    default: module.LoginLayout
  }))
);
