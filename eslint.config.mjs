import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  // Tooling config uses CommonJS-style requires and loosely typed plugin helpers.
  { ignores: ["tailwind.config.ts"] },
];

export default eslintConfig;
