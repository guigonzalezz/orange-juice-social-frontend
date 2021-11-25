import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  colors: {
    myColors: {
      "700": "#080001",
      "600": "#282828",
      "500": "#6C6C6C",
      "gradient-login": "linear-gradient(#FECE00, #F96400)",
      "fcamara":"#F96400"
    },
    gray: {
      "900": "#181B23",
      "800": "#1F2029",
      "700": "#353646",
      "600": "#4B4D63",
      "500": "#616480",
      "400": "#797D9A",
      "300": "#9699B0",
      "200": "#B3B5C6",
      "100": "#D1D2DC",
      "50": "#EEEEF2",
    }
  },
  fonts: {
    heading: 'Roboto',
    body: 'Roboto'
  },
  styles: {
    global: {
      body: {
        bg: 'myColors.700',
        color: 'gray.50'
      }
    }
  }
})