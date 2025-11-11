// src/theme.ts
import { extendTheme, theme as baseTheme, type ThemeConfig } from "@chakra-ui/react";
import type { StyleFunctionProps } from "@chakra-ui/styled-system";



const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

// Pastel brand inspired by your screenshots
const colors = {
  brand: {
    50:  "#FFF8EE", // cream canvas
    100: "#FEF2E3",
    200: "#FFE7C7",
    300: "#FFD7A6",
    400: "#FFC37A", // warm peach/orange accents
    500: "#F5A95A",
    600: "#DB8840",
    700: "#B96A2D",
    800: "#8F4E1E",
    900: "#6B3714",
  },
  mint: {
    50:  "#F0FFF8",
    100: "#DBF9EE",
    200: "#BFEADD",
    300: "#9EDCCB",
    400: "#7CCFBB",
    500: "#5ABFAA",
    600: "#3FA391",
    700: "#2F8273",
    800: "#236158",
    900: "#184741",
  },
  blush: {
    50:  "#FFF1F4",
    100: "#FFE3EA",
    200: "#FFD5DF",
    300: "#FFC1CF",
    400: "#FFA7BC",
    500: "#FF90AE",
    600: "#E1718F",
    700: "#BF5473",
    800: "#964059",
    900: "#6F2E41",
  },
  ink: {
    50:  "#F5F7FB",
    100: "#E9EEF6",
    200: "#D6DEEB",
    300: "#BAC8E0",
    400: "#94A3B8",
    500: "#475569", // headings/nav
    600: "#334155",
    700: "#1F2937",
    800: "#0F172A",
    900: "#0B1220",
  },
  sunshine: {
    50:  "#FFFAE6",
    100: "#FFF4C2",
    200: "#FFE992",
    300: "#FEDD64",
    400: "#F8E27A", // friendly yellow buttons
    500: "#E9C94F",
    600: "#C6A738",
    700: "#9F8528",
    800: "#79661C",
    900: "#5B4C13",
  },
  sky: {
  50:  "#E6F3FF",
  100: "#CCE7FF",
  200: "#99CEFF",
  300: "#66B5FF",
  400: "#339CFF", // friendly blue buttons
  500: "#007FFF",
  600: "#0066CC",
  700: "#004C99",
  800: "#003366",
  900: "#00264D",
},
};

const surfaces = {
  canvas: colors.brand[50], // cream
  card: "#FFFFFF",
};

const theme = extendTheme({
  config,
  fonts: {
    heading: `'Fredoka', ${baseTheme.fonts.heading}`,
    body: `'Fredoka', ${baseTheme.fonts.body}`,
  },
  colors: {
    ...colors,
    surfaces,
  },
  styles: {
    global: {
      body: {
        bg: surfaces.canvas,
        color: "ink.700",
      },
      a: { color: "ink.700" },
    },
  },
  components: {
    Button: {
      baseStyle: { fontWeight: 700, borderRadius: "lg" },
      sizes: {
      lg: { h: 12, px: 6 }, // a bit slimmer than pill style
      md: { h: 10, px: 5 },
      sm: { h: 9, px: 4 },
    },
      variants: {
        solid: (props: StyleFunctionProps) => {
          const scheme = props.colorScheme || "sunshine";
          return {
            bg: `${scheme}.400`,
            color: "ink.800",
            borderRadius: "lg",
            _hover: { bg: `${scheme}.300`, transform: "translateY(-1px)" },
            _active: { bg: `${scheme}.500`, transform: "translateY(0px)" },
            boxShadow: "md",
          };
        },
        outline: (props: StyleFunctionProps) => {
          const scheme = props.colorScheme || "mint";
          return {
            borderWidth: "2px",
            borderColor: `${scheme}.500`,
            color: `${scheme}.700`,
            _hover: { bg: `${scheme}.50` },
          };
        },
        ghost: (props: StyleFunctionProps) => {
          const scheme = props.colorScheme || "mint";
          return { color: `${scheme}.700`, _hover: { bg: `${scheme}.50` } };
        },
      },
      defaultProps: { colorScheme: "sunshine", size: "lg" },
    },
    // optional: unify other components too
  Tag: { baseStyle: { borderRadius: "md" } },
  Input: { baseStyle: { field: { borderRadius: "md" } } },
  Select: { baseStyle: { field: { borderRadius: "md" } } },
  Textarea: { baseStyle: { borderRadius: "md" } },

    Card: {
      baseStyle: {
        container: {
          borderRadius: "2xl",
          boxShadow: "xl",
          bg: "white",
          border: "1px solid",
          borderColor: "blackAlpha.100",
        },
      },
    },
    Link: { baseStyle: { color: "ink.700", fontWeight: 600 } },
  },
});

export default theme;
