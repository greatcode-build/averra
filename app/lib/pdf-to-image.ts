import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export async function convertPdfToImage(
  file: File,
): Promise<PdfConversionResult> {
  let imageUrl = "";

  try {
    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
    }).promise;

    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 4 });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      return {
        imageUrl: "",
        file: null,
        error: "Failed to create canvas context",
      };
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    await page.render({
      canvas,
      canvasContext: context,
      viewport,
    }).promise;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error("Failed to create image blob"));
        }
      }, "image/png");
    });

    const originalName = file.name.replace(/\.pdf$/i, "");

    const imageFile = new File([blob], `${originalName}.png`, {
      type: "image/png",
    });

    imageUrl = URL.createObjectURL(blob);

    return {
      imageUrl,
      file: imageFile,
    };
  } catch (error) {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }

    return {
      imageUrl: "",
      file: null,
      error: `Failed to convert PDF: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
