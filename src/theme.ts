import { extendTheme, theme as baseTheme, type ThemeConfig } from '@chakra-ui/react'
import type { StyleFunctionProps } from '@chakra-ui/styled-system'

const brandPalette = {
  50: '#e3f2ff',
  100: '#b6dcff',
  200: '#8ac6ff',
  300: '#5eafff',
  400: '#3499f5',
  500: '#1d7fd9',
  600: '#1565bf',
  700: '#0d4b96',
  800: '#06326a',
  900: '#021a3d',
}

const accentPalette = {
  50: '#fff1f2',
  100: '#ffdde0',
  200: '#ffc8cf',
  300: '#ffb3bf',
  400: '#ff90a1',
  500: '#fb6c86',
  600: '#da4b6a',
  700: '#b22f4f',
  800: '#861e39',
  900: '#590f24',
}

const surfaces = {
  canvas: '#fefcf7',
  card: '#ffffff',
  gradientTop: '#fef4e7',
  gradientBottom: '#e6f3ff',
}

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  fonts: {
    heading: `'Inter', ${baseTheme.fonts.heading}`,
    body: `'Inter', ${baseTheme.fonts.body}`,
  },
  colors: {
    brand: brandPalette,
    accent: accentPalette,
    surfaces,
  },
  semanticTokens: {
    colors: {
      'chakra-body-text': {
        default: '#000000',
        _dark: '#000000',
      },
      'chakra-body-bg': {
        default: surfaces.canvas,
        _dark: surfaces.canvas,
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: surfaces.canvas,
        color: '#000000',
      },
      a: {
        color: '#000000',
      },
    },
  },
  components: {
    Button: {
      baseStyle: { fontWeight: '600', borderRadius: 'lg' },
      variants: {
        solid: (props: StyleFunctionProps) => {
          const palette = props.colorScheme === 'accent' ? 'accent' : 'brand'
          return {
            bg: `${palette}.400`,
            color: '#ffffff',
            _hover: { bg: `${palette}.500` },
            _active: { bg: `${palette}.600` },
          }
        },
        outline: (props: StyleFunctionProps) => {
          const palette = props.colorScheme === 'accent' ? 'accent' : 'brand'
          return {
            borderColor: `${palette}.500`,
            color: `${palette}.600`,
            _hover: { bg: `${palette}.50` },
          }
        },
        ghost: (props: StyleFunctionProps) => {
          const palette = props.colorScheme === 'accent' ? 'accent' : 'brand'
          return {
            color: `${palette}.600`,
            _hover: { bg: `${palette}.50` },
          }
        },
      },
      defaultProps: {
        colorScheme: 'brand',
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: '2xl',
          boxShadow: 'xl',
          background: surfaces.card,
        },
      },
    },
    Link: {
      baseStyle: {
        color: 'brand.600',
        fontWeight: '600',
      },
    },
  },
})

export default theme
