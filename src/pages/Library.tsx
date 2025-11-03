import type { CSSProperties, MouseEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

// Updated import path for V2
import type { LibraryBook } from "../data/library";
import { libraryBooks } from "../data/library";

export const Library = () => {
  const currentBook = useMemo(
    () => libraryBooks.find((book) => book.status === "current") ?? null,
    []
  );

  const completedBooks = useMemo(
    () => libraryBooks.filter((book) => book.status === "completed"),
    []
  );

  const [selectedBookId, setSelectedBookId] = useState<string | null>(
    currentBook?.id ?? completedBooks[0]?.id ?? null
  );

  const selectedBook = useMemo(() => {
    if (!selectedBookId) {
      return currentBook ?? completedBooks[0] ?? null;
    }

    return (
      libraryBooks.find((book) => book.id === selectedBookId) ??
      currentBook ??
      completedBooks[0] ??
      null
    );
  }, [selectedBookId, currentBook, completedBooks]);

  const handleBookSelect = (bookId: string) => {
    setSelectedBookId(bookId);
  };

  return (
    // Replaced V1 layout wrapper with V2's page padding and text colors
    <div
      className="flex flex-1 flex-col overflow-y-auto p-6 md:p-16 text-primary"
    >
      {/* Removed V1 <MobileNav /> and <header /> */}
      <section className="flex flex-col gap-4 md:gap-7 pt-16 md:pt-8 lg:pt-10">
        {selectedBook ? (
          <div className="flex flex-col gap-6">
            {/* Mobile Layout: Book on left, title and description on right */}
            <div className="flex flex-col gap-6 md:hidden">
              {/* Book and Info side by side */}
              <div className="flex gap-4 items-start">
                {/* Smaller book preview on the left */}
                <div className="w-32 flex-shrink-0">
                  <HeroBook book={selectedBook} isMobile />
                </div>

                {/* Title, Author, Description, and Rating on the right */}
                <div className="flex flex-1 flex-col gap-3">
                  <div>
                    {/* V2 'text-primary' */}
                    <h1 className="text-xl font-serif leading-tight text-primary">
                      {selectedBook.title}
                    </h1>
                    {/* V2 'text-secondary' */}
                    <p className="mt-2 text-xs uppercase tracking-[0.25em] text-secondary">
                      {selectedBook.author} · {selectedBook.year}
                    </p>
                  </div>

                  {/* Description directly under title */}
                  {/* V2 'text-secondary' */}
                  <p className="text-sm leading-relaxed text-secondary">
                    {selectedBook.description}
                  </p>

                  {/* Rating */}
                  {selectedBook.rating !== undefined && (
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const rating = selectedBook.rating!;
                        const isFull = star <= rating;
                        const isHalf = star === Math.ceil(rating) && rating % 1 !== 0;

                        return (
                          <div key={star} className="relative h-5 w-5">
                            <svg
                              // V2 'border-secondary/50' equivalent
                              className="absolute inset-0 h-5 w-5 text-secondary/30"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {(isFull || isHalf) && (
                              <svg
                                // V2 standard color
                                className="absolute inset-0 h-5 w-5 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                style={isHalf ? { clipPath: 'inset(0 50% 0 0)' } : undefined}
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Review box */}
              {/* V2 styles: 'border-secondary/50', 'bg-surface/40' */}
              <div className="flex flex-col gap-4 rounded-xl border border-secondary/50 bg-surface/40 p-6 backdrop-blur-sm">
                {/* V2 'text-secondary' */}
                <p className="text-sm italic text-secondary">
                  {selectedBook.review ?? "thoughts coming soon"}
                </p>
              </div>
            </div>

            {/* Desktop Layout: Original layout */}
            <div className="hidden md:flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-12">
              <HeroBook book={selectedBook} />
              <div className="flex flex-1 flex-col gap-5">
                <div>
                  {/* V2 'text-primary' */}
                  <h1 className="text-3xl font-serif leading-tight lg:text-[38px] text-primary">
                    {selectedBook.title}
                  </h1>
                  {/* V2 'text-secondary' */}
                  <p className="mt-3 text-sm uppercase tracking-[0.25em] text-secondary">
                    {selectedBook.author} · {selectedBook.year}
                  </p>
                </div>
                {/* V2 'text-secondary' */}
                <p className="max-w-3xl text-base leading-relaxed text-secondary">
                  {selectedBook.description}
                </p>
              </div>
              {/* V2 styles: 'border-secondary/50', 'bg-surface/40' */}
              <div className="flex h-72 flex-1 flex-col gap-6 rounded-xl border border-secondary/50 bg-surface/40 p-8 backdrop-blur-sm">
                {selectedBook.rating !== undefined && (
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const rating = selectedBook.rating!;
                      const isFull = star <= rating;
                      const isHalf = star === Math.ceil(rating) && rating % 1 !== 0;

                      return (
                        <div key={star} className="relative h-8 w-8">
                          <svg
                            // V2 'border-secondary/50' equivalent
                            className="absolute inset-0 h-8 w-8 text-secondary/30"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {(isFull || isHalf) && (
                            <svg
                              // V2 standard color
                              className="absolute inset-0 h-8 w-8 text-yellow-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              style={isHalf ? { clipPath: 'inset(0 50% 0 0)' } : undefined}
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {/* V2 'text-secondary' */}
                <p className="text-base italic text-secondary">
                  {selectedBook.review ?? "thoughts coming soon"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          // V2 'text-secondary'
          <p className="text-base text-secondary">
            No books in the queue yet. Add a current read to populate this view.
          </p>
        )}
      </section>

      <section className="mt-12 md:mt-16 flex flex-col gap-10 pb-16">
        <div className="relative">
          {/* Mobile Layout */}
          <div className="flex flex-col gap-6 md:hidden">
            {/* Currently Reading - Mobile */}
            {currentBook && (
              <div className="flex flex-col gap-2">
                {/* V2 'text-secondary' */}
                <span className="text-xs uppercase tracking-[0.45em] text-secondary">
                  Currently Reading
                </span>
                <div className="flex justify-start">
                  <div className="w-32">
                    <button
                      type="button"
                      onClick={() => handleBookSelect(currentBook.id)}
                      aria-pressed={selectedBook?.id === currentBook.id}
                      className={`relative flex w-full overflow-hidden rounded-lg transition-transform aspect-[2/3] ${
                        selectedBook?.id === currentBook.id
                          ? "-translate-y-1"
                          : "hover:-translate-y-1"
                      }`}
                    >
                      <BookArt book={currentBook} />
                      <span className="sr-only">{currentBook.title} by {currentBook.author}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Previously Read - Mobile: 3-4 columns, scrollable to screen edge */}
            <div className="flex flex-col gap-3">
              {/* V2 'text-secondary' */}
              <span className="text-xs uppercase tracking-[0.45em] text-secondary">
                Previously Read
              </span>
              <div className="relative -mx-6 px-6">
                <div className="custom-scrollbar overflow-x-auto pb-4">
                  {completedBooks.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {completedBooks.map((book) => {
                        const isSelected = selectedBook?.id === book.id;

                        return (
                          <button
                            key={book.id}
                            type="button"
                            onClick={() => handleBookSelect(book.id)}
                            aria-pressed={isSelected}
                            className={`relative flex w-full overflow-hidden rounded-lg transition-transform aspect-[2/3] ${
                              isSelected
                                ? "-translate-y-1"
                                : "hover:-translate-y-1"
                            }`}
                          >
                            <BookArt book={book} />
                            <span className="sr-only">{book.title} by {book.author}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    // V2 styles
                    <div className="flex h-32 w-full items-center justify-center border border-dashed border-secondary/50 text-xs text-secondary">
                      Add previously read books to fill this shelf.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Original */}
          <div className="hidden md:flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
            {currentBook ? (
              <div className="flex w-[11rem] shrink-0 flex-col items-start gap-3">
                {/* V2 'text-secondary' */}
                <span className="whitespace-nowrap text-xs uppercase tracking-[0.45em] text-secondary">
                  Currently Reading
                </span>
                <div className="group relative w-full">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-[-10%] rounded-xl opacity-20 blur-2xl transition-opacity group-hover:opacity-35"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(253, 224, 71, 0.55), rgba(250, 204, 21, 0.2))",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleBookSelect(currentBook.id)}
                    aria-pressed={selectedBook?.id === currentBook.id}
                    // V2 focus styles
                    className={`relative flex w-full shrink-0 overflow-hidden rounded-lg transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aspect-[2/3] ${
                      selectedBook?.id === currentBook.id
                        ? "-translate-y-1"
                        : "hover:-translate-y-1"
                    }`}
                  >
                    <BookArt book={currentBook} />
                    <span className="sr-only">{currentBook.title} by {currentBook.author}</span>
                  </button>
                </div>
              </div>
            ) : null}
            <div className="flex flex-1 flex-col gap-4 lg:pl-4">
              <div className="flex items-center justify-end gap-3">
                {/* V2 'text-secondary' */}
                <span className="whitespace-nowrap text-xs uppercase tracking-[0.45em] text-secondary">
                  Previously Read
                </span>
              </div>
              <div className="relative">
                <div className="custom-scrollbar max-h-[52vh] overflow-y-auto pr-2 pb-12">
                  {completedBooks.length > 0 ? (
                    // V2: using auto-fill for responsiveness
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-4">
                      {completedBooks.map((book) => {
                        const isSelected = selectedBook?.id === book.id;

                        return (
                          <div key={book.id} className="flex justify-start">
                            <button
                              type="button"
                              onClick={() => handleBookSelect(book.id)}
                              aria-pressed={isSelected}
                              // V2 focus styles
                              className={`relative flex w-full shrink-0 overflow-hidden rounded-lg transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aspect-[2/3] ${
                                isSelected
                                  ? "-translate-y-1"
                                  : "hover:-translate-y-1"
                              }`}
                            >
                              <BookArt book={book} />
                              <span className="sr-only">{book.title} by {book.author}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    // V2 styles
                    <div className="flex h-48 w-full items-center justify-center border border-dashed border-secondary/50 text-xs text-secondary">
                      Add previously read books to fill this shelf.
                    </div>
                  )}
                </div>
                {/* V2 'bg-background' */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

type BookArtProps = {
  book: LibraryBook;
};

const BookArt = ({ book }: BookArtProps) => {
  const coverSrc = getCoverSource(book.coverImage);
  const [isBroken, setIsBroken] = useState(false);
  const hasCover = Boolean(coverSrc) && !isBroken;
  useEffect(() => {
    setIsBroken(false);
  }, [coverSrc]);
  const scale = book.coverScale ?? 1;
  const imageStyle =
    scale !== 1
      ? { transform: `scale(${scale})`, transformOrigin: "center" }
      : undefined;

  const fallbackStyle: CSSProperties = {
    background: `linear-gradient(135deg, ${book.coverColor}, ${lightenHex(book.coverColor, 30)})`,
  };

  return (
    <div className="relative h-full w-full overflow-hidden shadow-[0_12px_26px_-22px_rgba(60,60,58,0.55)]">
      {hasCover ? (
        <img
          src={coverSrc}
          alt={`${book.title} cover`}
          className="h-full w-full object-cover"
          style={imageStyle}
          loading="lazy"
          onError={() => setIsBroken(true)}
        />
      ) : (
        <div
          className="flex h-full w-full flex-col justify-between p-4 text-white"
          style={fallbackStyle}
        >
          <div>
            <span className="text-xs uppercase tracking-[0.4em] text-white/80">{book.author}</span>
            <h4 className="mt-4 text-base font-semibold leading-tight">{book.title}</h4>
          </div>
          <span className="text-xs uppercase tracking-[0.3em] text-white/70">{book.year}</span>
        </div>
      )}
    </div>
  );
};

type HeroBookProps = {
  book: LibraryBook;
  isMobile?: boolean;
};

const HeroBook = ({ book, isMobile = false }: HeroBookProps) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isCoverBroken, setIsCoverBroken] = useState(false);
  const coverSrc = getCoverSource(book.coverImage);

  useEffect(() => {
    setIsCoverBroken(false);
  }, [coverSrc]);

  // Removed accelerometer-based rotation for mobile - keeping mouse interaction only

  const handleMouseMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (isMobile) return; // Disable mouse interaction on mobile

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const maxTilt = 20;
    const nextY = ((x - centerX) / centerX) * maxTilt;
    const nextX = -((y - centerY) / centerY) * maxTilt;

    setRotation({ x: nextX, y: nextY });
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (isMobile) return; // Disable mouse interaction on mobile
    setRotation({ x: 0, y: 0 });
  }, [isMobile]);

  const hasCover = Boolean(coverSrc) && !isCoverBroken;
  const imageScale = book.coverScale ?? 1;
  const coverImageStyle =
    imageScale !== 1
      ? { transform: `scale(${imageScale})`, transformOrigin: "center" }
      : undefined;
  const fallbackStyle: CSSProperties = {
    background: `linear-gradient(135deg, ${book.coverColor}, ${lightenHex(book.coverColor, 30)})`,
  };

  // Mobile: smaller dimensions
  const perspective = isMobile ? 520 : 780;
  const bookWidth = isMobile ? 128 : 192; // w-32 for mobile, w-48 for desktop
  const bookHeight = isMobile ? 192 : 288; // h-48 for mobile, h-72 for desktop
  const spineThickness = isMobile ? 18 : 26;
  const pageColor = "#f5f1e6";

  return (
    <div
      className={isMobile ? "relative h-48 w-32" : "relative h-72 w-48"}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="absolute inset-0 opacity-25 blur-3xl"
          style={{
            background: `radial-gradient(circle at 50% 65%, ${book.accentColor}45, transparent 70%)`,
          }}
        />
      <div
        className="relative h-full w-full"
        style={{ perspective }}
      >
        <div
          className="absolute inset-0 shadow-[0_55px_95px_-48px_rgba(34,34,32,0.92)] transition-transform"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` +
              ` translateZ(${spineThickness / 2}px)`,
            transition: "transform 100ms ease-out",
          }}
        >
          <div
            className="absolute left-1/2 top-1/2 h-full w-full overflow-hidden"
            style={{ transform: `translate(-50%, -50%) translateZ(${spineThickness / 2}px)` }}
          >
            {hasCover ? (
              <img
                src={coverSrc}
                alt={`${book.title} cover`}
                className="h-full w-full object-cover"
                style={coverImageStyle}
                onError={() => setIsCoverBroken(true)}
              />
            ) : (
              <div
                className="flex h-full w-full flex-col justify-between p-6 text-white"
                style={fallbackStyle}
              >
                <div>
                  <span className="text-xs uppercase tracking-[0.4em] text-white/80">{book.author}</span>
                  <h4 className="mt-4 text-base font-semibold leading-tight">{book.title}</h4>
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-white/70">{book.year}</span>
              </div>
            )}
          </div>
          <div
            className="absolute left-1/2 top-1/2 h-full overflow-hidden"
            style={{
              width: spineThickness,
              transform: `translate(-50%, -50%) rotateY(-90deg) translateZ(${bookWidth / 2}px)`,
              background: `linear-gradient(180deg, ${lightenHex(book.spineColor, 20)}, ${book.spineColor})`,
            }}
          >
            <div className="flex h-full w-full items-center justify-center">
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.4em] text-white/85"
                style={{ writingMode: "vertical-rl" }}
              >
                {book.title}
              </span>
            </div>
          </div>
          <div
            className="absolute left-1/2 top-1/2 h-full overflow-hidden"
            style={{
              width: spineThickness,
              transform: `translate(-50%, -50%) rotateY(90deg) translateZ(${bookWidth / 2}px)`,
              background: `linear-gradient(90deg, ${pageColor}, ${lightenHex(pageColor, 8)})`,
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 w-full overflow-hidden"
            style={{
              height: spineThickness,
              transform: `translate(-50%, -50%) rotateX(90deg) translateZ(${bookHeight / 2}px)`,
              background: `linear-gradient(90deg, ${pageColor}, ${lightenHex(pageColor, 10)})`,
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 w-full overflow-hidden"
            style={{
              height: spineThickness,
              transform: `translate(-50%, -50%) rotateX(-90deg) translateZ(${bookHeight / 2}px)`,
              background: `linear-gradient(90deg, ${lightenHex(pageColor, 6)}, ${pageColor})`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

const lightenHex = (hex: string, amount: number) => {
  const sanitized = hex.replace("#", "");
  const bigint = parseInt(sanitized, 16);

  if (Number.isNaN(bigint)) {
    return hex;
  }

  const r = Math.min(255, ((bigint >> 16) & 255) + amount);
  const g = Math.min(255, ((bigint >> 8) & 255) + amount);
  const b = Math.min(255, (bigint & 255) + amount);
  return `rgb(${r}, ${g}, ${b})`;
};

const getCoverSource = (src?: string) => {
  if (!src) {
    return undefined;
  }
  
  // If it's a local V2 path, just return it.
  if (src.startsWith('/')) {
    return src;
  }

  if (!/^https?:/i.test(src)) {
    return src;
  }

  const sanitized = src.replace(/^https?:\/\//i, "");
  const encoded = encodeURIComponent(sanitized);
  return `https://images.weserv.nl/?url=${encoded}&w=700&h=1050&fit=cover`;
};

// V2 requires a default export for pages
export default Library;

