import { defineConfig } from "unocss";
import { presetUno } from "@unocss/preset-uno";

export default defineConfig({
  include: ["src/**/*.{js,jsx,ts,tsx,html}", "public/*.html"],
  presets: [presetUno()],
});
