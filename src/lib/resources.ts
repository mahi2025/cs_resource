import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

export type Resource = {
  id: string;
  title: string;
  subject: string;
  year: number;
  category: "Exit" | "Non-Exit";
  fileName: string;
  fileType: string;
  downloadUrl: string;
  pdfUrl: string;
};

const RESOURCES_DIR = path.join(process.cwd(), "public", "resources");

const SUPPORTED_EXTENSIONS = [
  ".pdf",
  ".pptx",
  ".docx",
  ".doc",
  ".odp",
];

export async function getResources(): Promise<Resource[]> {
  const resources: Resource[] = [];

  const subjects = await fs.readdir(RESOURCES_DIR, {
    withFileTypes: true,
  });

  for (const subjectFolder of subjects) {
    if (!subjectFolder.isDirectory()) continue;

    const subject = subjectFolder.name;
    const subjectPath = path.join(RESOURCES_DIR, subject);
    const metadataPath = path.join(subjectPath, "metadata.json");

    let metadata;

    try {
      metadata = JSON.parse(
        await fs.readFile(metadataPath, "utf-8")
      );
    } catch {
      console.warn(`Missing or invalid metadata: ${subject}`);
      continue;
    }

    const files = await fs.readdir(subjectPath, {
      withFileTypes: true,
    });

    for (const file of files) {
      if (!file.isFile()) continue;

      const fileName = file.name;
      const extension = path.extname(fileName).toLowerCase();

      if (!SUPPORTED_EXTENSIONS.includes(extension)) continue;

      const fileMetadata = metadata.resources?.[fileName];

      if (!fileMetadata) {
        console.warn(`Missing metadata for: ${subject}/${fileName}`);
        continue;
      }

      const baseName = path.basename(fileName, extension);

      const previewFileName =
        extension === ".pdf"
          ? fileName
          : `${baseName}.preview.pdf`;

      const previewPath = path.join(subjectPath, previewFileName);

      try {
        await fs.access(previewPath);
      } catch {
        console.warn(`Missing PDF preview: ${subject}/${previewFileName}`);
        continue;
      }

      const encodedSubject = encodeURIComponent(subject);

      resources.push({
        id: `${subject}/${fileName}`,
        title: fileMetadata.title,
        subject,
        year: metadata.year,
        category: fileMetadata.category,
        fileName,
        fileType: extension.replace(".", "").toUpperCase(),

        downloadUrl: `/resources/${encodedSubject}/${encodeURIComponent(fileName)}`,

        pdfUrl: `/resources/${encodedSubject}/${encodeURIComponent(previewFileName)}`,
      });
    }
  }

  return resources.sort((a, b) =>
    a.subject.localeCompare(b.subject) ||
    a.title.localeCompare(b.title)
  );
}