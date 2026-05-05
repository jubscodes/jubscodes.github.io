"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

type GalleryImage = { src: string; alt: string };

type GalleryModalProps = {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

const SWIPE_THRESHOLD = 50;

export function GalleryModal({
  images,
  currentIndex,
  isOpen,
  onClose,
  onPrev,
  onNext,
}: GalleryModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onNext();
      } else if (e.key === "Tab") {
        // Trap focus inside the dialog
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusable = dialog.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose, onPrev, onNext],
  );

  useEffect(() => {
    if (!isOpen) return;
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    // Defer focus until the dialog has rendered
    const id = window.requestAnimationFrame(() => {
      dialogRef.current?.focus();
    });
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      window.cancelAnimationFrame(id);
      previouslyFocusedRef.current?.focus();
    };
  }, [isOpen, handleKeyDown]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const dx = endX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (dx > 0) onPrev();
    else onNext();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  const current = images[currentIndex];
  if (!current) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery"
      tabIndex={-1}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex flex-col bg-bg/95 backdrop-blur-sm outline-none"
    >
      <div className="flex items-center justify-between px-6 py-4 font-mono text-xs">
        <span className="text-muted">
          {currentIndex + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          aria-label="Close gallery"
          className="text-fg transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-secondary"
        >
          × close
        </button>
      </div>

      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative flex flex-1 items-center justify-center px-6 py-2"
      >
        {images.map((img, i) => (
          <div
            key={i}
            aria-hidden={i !== currentIndex}
            className="absolute inset-0 m-auto flex items-center justify-center px-6 py-2 transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ opacity: i === currentIndex ? 1 : 0 }}
          >
            <div className="relative h-full w-full">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority={i === currentIndex}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-6 px-6 py-6 font-mono text-xs sm:justify-center sm:gap-8">
        <button
          onClick={onPrev}
          aria-label="Previous image"
          className="text-fg transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-secondary"
        >
          ← prev
        </button>
        <span className="hidden text-muted sm:inline" aria-live="polite">
          {current.alt}
        </span>
        <button
          onClick={onNext}
          aria-label="Next image"
          className="text-fg transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-secondary"
        >
          next →
        </button>
      </div>
    </div>
  );
}
