"use client";

import type { SVGProps } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type BrandIconProps = SVGProps<SVGSVGElement>;

function IconGitHub({ className, ...props }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
      {...props}
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function IconTwitter({ className, ...props }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IconYoutube({ className, ...props }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
      {...props}
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function IconLinkedin({ className, ...props }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
      {...props}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export interface ProfileCarouselItem {
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  githubUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
}

export interface TestimonialCarouselProps {
  items: ProfileCarouselItem[];
  className?: string;
}

export function TestimonialCarousel({
  items,
  className,
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (items.length === 0) {
    return null;
  }

  const handleNext = () =>
    setCurrentIndex((index) => (index + 1) % items.length);
  const handlePrevious = () =>
    setCurrentIndex(
      (index) => (index - 1 + items.length) % items.length
    );

  const current = items[currentIndex];

  const socialIcons = [
    { icon: IconGitHub, url: current.githubUrl, label: "GitHub" },
    { icon: IconTwitter, url: current.twitterUrl, label: "X" },
    { icon: IconYoutube, url: current.youtubeUrl, label: "YouTube" },
    { icon: IconLinkedin, url: current.linkedinUrl, label: "LinkedIn" },
  ].filter((s): s is typeof s & { url: string } => Boolean(s.url));

  return (
    <div className={cn("mx-auto w-full max-w-5xl px-4", className)}>
      {/* Desktop layout */}
      <div className="relative hidden items-center md:flex">
        <div className="h-[470px] w-[470px] flex-shrink-0 overflow-hidden rounded-3xl bg-gray-200 dark:bg-neutral-800">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.imageUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="h-full w-full"
            >
              <Image
                src={current.imageUrl}
                alt={current.name}
                width={470}
                height={470}
                className="h-full w-full object-cover"
                draggable={false}
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="z-10 ml-[-80px] max-w-xl flex-1 rounded-3xl bg-white p-8 shadow-2xl dark:bg-card">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="mb-6">
                <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {current.name}
                </h2>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-500">
                  {current.title}
                </p>
              </div>

              <p className="mb-8 text-base leading-relaxed text-black dark:text-white">
                {current.description}
              </p>

              {socialIcons.length > 0 ? (
                <div className="flex space-x-4">
                  {socialIcons.map(({ icon: IconComponent, url, label }) => (
                    <Link
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-900 transition-colors hover:scale-105 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200"
                      aria-label={label}
                    >
                      <IconComponent className="h-5 w-5 text-white dark:text-gray-900" />
                    </Link>
                  ))}
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="mx-auto max-w-sm bg-transparent text-center md:hidden">
        <div className="mb-6 aspect-square w-full overflow-hidden rounded-3xl bg-gray-200 dark:bg-gray-700">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.imageUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="h-full w-full"
            >
              <Image
                src={current.imageUrl}
                alt={current.name}
                width={400}
                height={400}
                className="h-full w-full object-cover"
                draggable={false}
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                {current.name}
              </h2>
              <p className="mb-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                {current.title}
              </p>
              <p className="mb-6 text-sm leading-relaxed text-black dark:text-white">
                {current.description}
              </p>
              {socialIcons.length > 0 ? (
                <div className="flex justify-center space-x-4">
                  {socialIcons.map(({ icon: IconComponent, url, label }) => (
                    <Link
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-900 transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200"
                      aria-label={label}
                    >
                      <IconComponent className="h-5 w-5 text-white dark:text-gray-900" />
                    </Link>
                  ))}
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={handlePrevious}
          aria-label="Previous team member"
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-gray-100 shadow-md transition-colors hover:bg-gray-200 dark:border-card/40 dark:bg-card dark:hover:bg-card/80"
        >
          <ChevronLeft className="h-6 w-6 text-gray-700 dark:text-gray-50" />
        </button>

        <div className="flex gap-2">
          {items.map((_, i) => (
            <button
              key={items[i].name}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "h-3 w-3 cursor-pointer rounded-full transition-colors",
                i === currentIndex
                  ? "bg-gray-900 dark:bg-white"
                  : "bg-gray-400 dark:bg-gray-600"
              )}
              aria-label={`Go to team member ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next team member"
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-gray-100 shadow-md transition-colors hover:bg-gray-200 dark:border-card/40 dark:bg-card dark:hover:bg-card/80"
        >
          <ChevronRight className="h-6 w-6 text-gray-700 dark:text-gray-50" />
        </button>
      </div>
    </div>
  );
}
