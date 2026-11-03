import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const RESOURCES_DIR = path.join(process.cwd(), "public", "resources");

const SUPPORTED_EXTENSIONS = [".pptx", ".docx", ".doc", ".odp"];

async function convertFile(filePath, subjectDir) {
  const extension = path.extname(filePath).toLowerCase();
  const baseName = path.basename(filePath, extension);

  // Keep generated previews separate from original files.
  const previewName = `${baseName}.preview.pdf`;
  const previewPath = path.join(subjectDir, previewName);

  // Do not convert again if the preview is already up to date.
  try {
    const [source, preview] = await Promise.all([
      fs.stat(filePath),
      fs.stat(previewPath),
    ]);

    if (preview.mtimeMs >= source.mtimeMs) {
      console.log(`Already converted: ${path.basename(filePath)}`);
      return;
    }
  } catch {
    // Preview doesn't exist yet; continue with conversion.
  }

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "resource-pdf-"));

  try {
    await execFileAsync("libreoffice", [
      "--headless",
      `-env:UserInstallation=file://${path.join(tempDir, "profile")}`,
      "--convert-to",
      "pdf",
      "--outdir",
      tempDir,
      filePath,
    ]);

    const generatedPdf = path.join(tempDir, `${baseName}.pdf`);

    await fs.access(generatedPdf);
    await fs.copyFile(generatedPdf, previewPath);

    console.log(`Converted: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`Failed to convert ${path.basename(filePath)}:`, error.message);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

async function main() {
  const subjects = await fs.readdir(RESOURCES_DIR, {
    withFileTypes: true,
  });

  for (const subject of subjects) {
    if (!subject.isDirectory()) continue;

    const subjectDir = path.join(RESOURCES_DIR, subject.name);
    const files = await fs.readdir(subjectDir, { withFileTypes: true });

    for (const file of files) {
      if (!file.isFile()) continue;

      const extension = path.extname(file.name).toLowerCase();

      if (!SUPPORTED_EXTENSIONS.includes(extension)) continue;

      await convertFile(path.join(subjectDir, file.name), subjectDir);
    }
  }
}

main().catch((error) => {
  console.error("Resource conversion failed:", error);
  process.exit(1);
});