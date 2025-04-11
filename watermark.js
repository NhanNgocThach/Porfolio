import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, degrees } from 'pdf-lib';

const rawDir = './raw';
const outDir = './files';
const watermarkText = 'Nhan Ngoc Thach – Portfolio';

async function addWatermarkToPDF(inputPath, outputPath) {
  const existingPdfBytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();

  pages.forEach(page => {
    const { width, height } = page.getSize();
    page.drawText(watermarkText, {
      x: width / 2 - 120,
      y: height / 2,
      size: 24,
      opacity: 0.3,
      color: rgb(0.75, 0.75, 0.75),
      rotate: degrees(45),
    });
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);
}

// Process all PDF files in /raw
fs.readdirSync(rawDir).forEach(file => {
  if (file.endsWith('.pdf')) {
    const inputPath = path.join(rawDir, file);
    const outputPath = path.join(outDir, file);
    addWatermarkToPDF(inputPath, outputPath)
      .then(() => console.log(`✅ Watermarked: ${file}`))
      .catch(err => console.error(`❌ Failed: ${file}`, err));
  }
});
