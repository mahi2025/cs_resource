
import Image from "next/image";
import fs from "node:fs";
import path from "node:path";

const photosDirectory = path.join(
  process.cwd(),
  "public",
  "resources",
  "AI photos"
);

const photos = fs
  .readdirSync(photosDirectory)
  .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
  .sort();

export default function AIPhotosPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10">
          <h1 className="text-4xl font-bold">
            Intro to AI Photos
          </h1>

          <p className="mt-4 text-gray-600">
            Explore our artificial intelligence photo collection.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => {
            const imageUrl =
              `/resources/AI%20photos/${encodeURIComponent(photo)}`;

            return (
              <article
                key={photo}
                className="overflow-hidden rounded-xl border"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={imageUrl}
                    alt={photo.replace(/\.[^.]+$/, "")}
                    fill
                    sizes="(max-width: 640px) 100vw,
                           (max-width: 1024px) 50vw,
                           33vw"
                    className="object-cover"
                  />
                </div>

                <div className="p-4">
                  <h2 className="font-medium">
                    {photo.replace(/\.[^.]+$/, "")}
                  </h2>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
