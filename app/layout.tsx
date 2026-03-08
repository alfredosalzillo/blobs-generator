import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import theme from "./theme";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Blobs Generator",
  description:
    "Generate cute blobs with custom width, height, and download as SVG.",
  keywords: "blobs, generator, svg, design, illustration",
  authors: [{ name: "Alfredo Salzillo" }],
  openGraph: {
    title: "Blobs Generator",
    description:
      "Generate cute blobs with custom width, height, and download as SVG.",
    type: "website",
    url: "https://blobs-generator.vercel.app",
    siteName: "Blobs Generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blobs Generator",
    description:
      "Generate cute blobs with custom width, height, and download as SVG.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.variable}>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                bgcolor: "background.default",
              }}
            >
              <AppBar
                position="static"
                elevation={1}
                color="inherit"
                sx={{ borderBottom: "1px solid", borderColor: "divider" }}
              >
                <Toolbar>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      flexGrow: 1,
                      fontWeight: "bold",
                      color: "primary.main",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box component="span" sx={{ mr: 1 }}>
                      💧
                    </Box>
                    Blobs Generator
                  </Typography>
                </Toolbar>
              </AppBar>
              <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
                {children}
              </Container>
              <Box
                component="footer"
                sx={{
                  py: 3,
                  textAlign: "center",
                  borderTop: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  &copy; {new Date().getFullYear()} Blobs Generator. Made with ❤️
                </Typography>
              </Box>
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
