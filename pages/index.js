import Head from "next/head";
import { Box } from "@chakra-ui/layout";

import { Loader } from "@/components/loader";

export default function Home() {
  return (
    <Box>
      <Loader show />
    </Box>
  );
}
