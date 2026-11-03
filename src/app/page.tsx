
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Resource = {
  id: string;
  title: string;
  subject: string;
  year: number;
  category: "Exit" | "Non-Exit";
  fileName: string;
  previewFileName?: string;
};

function resourceUrl(subject: string, fileName: string) {
  return `/resources/${encodeURIComponent(subject)}/${encodeURIComponent(fileName)}`;
}

const resources: Resource[] = [
  {
    id: "1",
    title: "chapter 1 Intro to AI",
    subject: "Intro to AI",
    year:4,
    category: "Exit",
    fileName: "Chapter 1 - Intro to AI.pptx",
    previewFileName: "Chapter 1 - Intro to AI.pdf",
  },
  {
    id: "2",
    title: "Chapter 2 Intelligent Agents",
    subject: "Intro to AI",
    year: 4,
    category: "Non-Exit",
    fileName: "Chapter 2 - Intelligent Agents.pptx",
    previewFileName: "Chapter 2 - Intelligent Agents.pdf",
  },
  {
    id: "3",
    title: "Chapter 3 and 4 Searching",
    subject: "Intro to AI",
    year: 4,
    category: "Non-Exit",
    fileName: "ch3and 4 Searching algorithms.pdf",
  },
  {
    id: "4",
    title: "chapter 5 and 6",
    subject: "Intro to AI",
    year: 4,
    category: "Non-Exit",
    fileName: "Chapter 4 & 5 Full.pptx",
    previewFileName: "Chapter 4 & 5 Full.pdf",
  },
  {
    id: "5",
    title: "course outline",
    subject: "Intro to AI",
    year: 4,
    category: "Non-Exit",
    fileName: "Introduction to Artificial Intelligence.pdf",
  },
   {
    id: "5",
    title: "course outline",
    subject: "Mulimedia",
    year: 4,
    category: "Non-Exit",
    fileName: "Multimedia Course Plan.pdf",
  },
   {
    id: "6",
    title: "course outline",
    subject: "compiler",
    year: 3,
    category: "Exit",
    fileName: "Compiler Design.pdf",
  },
  {
    id: "6",
    title: "course outline",
    subject: "Design and Analysis of Algorithms",
    year: 3,
    category: "Exit",
    fileName: "Design and Analysis of Algorithms.pdf",
  },
];


const categories = ["Everything", "Exit", "Non-Exit"];

export default function Home() {
  const [activeCategory, setActiveCategory] =
    useState("Everything");

  const [query, setQuery] = useState("");

  const visibleResources = resources.filter((resource) => {
    const matchesCategory =
      activeCategory === "Everything" ||
      resource.category === activeCategory;

    const searchableText = [
      resource.title,
      resource.subject,
      String(resource.year),
      resource.category,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(
      query.trim().toLowerCase()
    );

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <a href="#top" className="font-serif text-2xl">
          Archive
        </a>
      </header>

      <section
        id="library"
        className="border-t border-rule bg-canvas"
      >
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search resources..."
              aria-label="Search resources"
              className="h-12 w-full border-b border-border-soft bg-transparent px-2 outline-none md:max-w-sm"
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
                variant={
                  activeCategory === category
                    ? "filterActive"
                    : "filter"
                }
                size="sm"
              >
                {category}
              </Button>
            ))}

            <span className="ml-auto self-center text-sm text-muted">
              {visibleResources.length} resources
            </span>
          </div>

          {visibleResources.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleResources.map((resource) => (
                <article
                  key={resource.id}
                  className="flex flex-col border border-border-soft bg-paper p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {resource.fileName.toLowerCase().endsWith(".pptx")
                        ? "PowerPoint Presentation"
                        : "PDF Document"}
                    </span>

                    <span className="rounded-full bg-sage-wash px-3 py-1 text-xs">
                      {resource.category}
                    </span>
                  </div>

                  <h3 className="mt-6 font-serif text-2xl">
                    {resource.title}
                  </h3>

                  <p className="mt-3 text-sm text-muted">
                    Subject: {resource.subject}
                  </p>

                  <p className="mt-2 text-sm text-muted">
                    Year: {resource.year}
                  </p>

                  <div className="mt-6 flex gap-3">
                    <a
                      href={resourceUrl(
                        resource.subject,
                        resource.previewFileName ?? resource.fileName
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-forest px-4 py-2 text-sm text-white"
                    >
                      View Document ↗
                    </a>

                    <a
                      href={resourceUrl(resource.subject, resource.fileName)}
                      download
                      className="rounded-full border border-border-soft px-4 py-2 text-sm"
                    >
                      Download
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="py-20 text-center text-muted">
              No resources found 
            </p>
          )}
        </div>
      </section>

      <footer
        id="about"
        className="mx-auto max-w-7xl px-6 py-8 text-sm"
      >
        <p style={{ textAlign: "center" }}>
            Mahi @2026 
        </p>
      </footer>
    </main>
  );
}
