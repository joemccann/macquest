import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Relax React 19 purity rules for game components that need randomness
      "react-hooks/purity": "off",
      "react-hooks/rules-of-hooks": "error",
    },
  },
]);

export default eslintConfig;
