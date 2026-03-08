"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import CopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import LinkIcon from "@mui/icons-material/Link";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { type BlobDescriptor, generateBlob } from "@alfredo.salzillo/blobs";

const Blob = dynamic(
  () => import("@alfredo.salzillo/blobs/Blob"),
  {
    ssr: false,
    loading: () => (
      <Box
        sx={{
          width: 300,
          height: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    ),
  },
);

export default function HomePage() {
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(300);
  const [blob, setBlob] = useState<BlobDescriptor | null>(null);
  const [apiResult, setApiResult] = useState<{ link: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const svgRef = useRef<HTMLDivElement>(null);

  const generateNewBlob = useCallback(() => {
    const newBlob = generateBlob(width, height);
    setBlob(newBlob);
    setApiResult(null);
  }, [width, height]);

  useEffect(() => {
    generateNewBlob();
  }, [generateNewBlob]);

  const handleDownloadSvg = () => {
    if (!svgRef.current) return;
    const svgElement = svgRef.current.querySelector("svg");
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new globalThis.Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `blob-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateViaApi = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/blob/generate?width=${width}&height=${height}`,
      );
      const data = await res.json();
      setApiResult(data);
      // We don't necessarily update the local blob here because the API returns a descriptor
      // which we could use, but the user might want to see the specific "API result"
    } catch (error) {
      console.error("Failed to generate via API", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    return navigator.clipboard.writeText(text);
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto" }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", textAlign: "center" }}
      >
        Create Your Perfect Blob
      </Typography>
      <Typography
        variant="h6"
        color="text.secondary"
        gutterBottom
        sx={{ textAlign: "center", mb: 6 }}
      >
        Customize and generate unique blobs for your design projects.
      </Typography>

      <Grid container spacing={4} alignItems="stretch">
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={2} sx={{ p: 4, height: "100%" }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Configuration
            </Typography>

            <Box sx={{ mb: 4 }}>
              <TextField
                label="Width (px)"
                type="number"
                value={width}
                onChange={(e) => setWidth(Number.parseInt(e.target.value) || 0)}
                fullWidth
                variant="outlined"
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <TextField
                label="Height (px)"
                type="number"
                value={height}
                onChange={(e) => setHeight(Number.parseInt(e.target.value) || 0)}
                fullWidth
                variant="outlined"
              />
            </Box>

            <Stack spacing={2}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<RefreshIcon />}
                onClick={generateNewBlob}
              >
                Regenerate
              </Button>

              <Button
                variant="outlined"
                fullWidth
                size="large"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadSvg}
                disabled={!blob}
              >
                Download SVG
              </Button>

              <Divider sx={{ my: 1 }}>OR</Divider>

              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                size="large"
                startIcon={
                  loading ? <CircularProgress size={20} /> : <LinkIcon />
                }
                onClick={generateViaApi}
                disabled={loading}
              >
                Generate via API
              </Button>
            </Stack>

            {apiResult && (
              <Box sx={{ mt: 3 }}>
                <Alert
                  severity="success"
                  action={
                    <Tooltip title="Copy Link">
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(apiResult.link)}
                      >
                        <CopyIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <Typography variant="body2" noWrap sx={{ width: "200px" }}>
                    API Link: {apiResult.link}
                  </Typography>
                </Alert>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Card
            elevation={0}
            variant="outlined"
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              bgcolor: "background.paper",
              borderColor: "divider",
            }}
          >
            <CardContent
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 4,
              }}
            >
              <Box
                ref={svgRef}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 300,
                  width: 300,
                }}
              >
                {blob && <Blob {...blob} animated />}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
          About Blobs
        </Typography>
        <Typography color="text.secondary" component="p" mt={2} mb={2}>
          This generator uses the <code>@alfredo.salzlillo/blobs</code> library
          to create organic, playful shapes known as blobs. Each blob is unique
          and comes with its own personality, complete with eyes and a vibrant
          color palette.
        </Typography>
        <Typography color="text.secondary">
          You can use the API endpoint to generate blobs dynamically in your own
          applications. Simply use the <code>/api/blob</code> or{" "}
          <code>/api/blob/generate</code> endpoints with your desired
          parameters.
        </Typography>
      </Box>
    </Box>
  );
}
