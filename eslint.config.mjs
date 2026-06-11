import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: ["orchestrav2/**", "orchestrav2-adifrontend/**"],
  },
  ...nextVitals,
  ...nextTypescript,
];

export default eslintConfig;
