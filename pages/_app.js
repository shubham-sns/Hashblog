import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";

const colors = {
  _bg: "#eef0f1",
  _text: "#08090a",
  _blue: "#3b49df",
  _red: "#df3b3b",
  _green: "#3bdf72",
  _gray: "#b5bdc4",
};

const theme = extendTheme({
  colors,
  fonts: {
    body: "Inter",
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme} resetCSS>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
