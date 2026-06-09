import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { createTheme, ThemeProvider } from "@mui/material";
import { MantineProvider } from "@mantine/core";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
const theme = createTheme({
  direction: "rtl",
});
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <MantineProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </MantineProvider>

    <Toaster position="top-center" />
  </QueryClientProvider>,
);
