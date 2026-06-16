import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { PhotoItem } from "../../data/birthdayConfig";

type PhotoLightboxProps = {
  photo: PhotoItem | null;
  categoryLabel?: string;
  onClose: () => void;

  // thêm mấy props này để lướt ảnh
  onPrevious?: () => void;
  onNext?: () => void;
  canNavigate?: boolean;
  currentIndex?: number;
  totalCount?: number;
};

export function PhotoLightbox({
  photo,
  categoryLabel,
  onClose,
  onPrevious,
  onNext,
  canNavigate = false,
  currentIndex,
  totalCount,
}: PhotoLightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!photo) return;

    const previousOverflow = document.body.style.overflow;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();

      if (canNavigate && event.key === "ArrowLeft") {
        onPrevious?.();
      }

      if (canNavigate && event.key === "ArrowRight") {
        onNext?.();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [photo, onClose, onPrevious, onNext, canNavigate]);

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/85 p-3 backdrop-blur-md sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Xem ảnh kỷ niệm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative flex max-h-[calc(100dvh-24px)] w-full max-w-4xl flex-col overflow-hidden rounded-[24px] border border-white/15 bg-white shadow-2xl sm:max-h-[calc(100dvh-32px)] sm:rounded-[28px]"
            initial={{ scale: 0.96, y: 18 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 18 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="absolute right-3 top-3 z-30 grid h-11 w-11 place-items-center rounded-full bg-slate-950/70 text-white shadow-lg transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-white"
              onClick={onClose}
              aria-label="Đóng ảnh"
            >
              <X size={22} />
            </button>

            {typeof currentIndex === "number" && typeof totalCount === "number" && (
              <div className="absolute left-3 top-3 z-30 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-slate-900 shadow-lg">
                {String(currentIndex + 1).padStart(2, "0")} /{" "}
                {String(totalCount).padStart(2, "0")}
              </div>
            )}

            {canNavigate && (
              <>
                <button
                  type="button"
                  className="absolute left-3 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-slate-950/75 text-white shadow-xl backdrop-blur transition hover:-translate-x-0.5 focus:outline-none focus:ring-4 focus:ring-white/60 md:grid"
                  onClick={onPrevious}
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft size={26} />
                </button>

                <button
                  type="button"
                  className="absolute right-3 top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-rose-500 text-white shadow-xl shadow-rose-500/25 transition hover:translate-x-0.5 focus:outline-none focus:ring-4 focus:ring-white/60 md:grid"
                  onClick={onNext}
                  aria-label="Ảnh tiếp theo"
                >
                  <ChevronRight size={26} />
                </button>
              </>
            )}

            <motion.div
              key={photo.id}
              className="min-h-0 flex-1 bg-slate-100"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.2 }}
              drag={canNavigate ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (!canNavigate) return;

                if (info.offset.x < -80) {
                  onNext?.();
                }

                if (info.offset.x > 80) {
                  onPrevious?.();
                }
              }}
            >
              {photo.src ? (
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="max-h-[62dvh] w-full bg-slate-100 object-contain sm:max-h-[68dvh] md:max-h-[72dvh]"
                  draggable={false}
                />
              ) : (
                <div className="grid min-h-[48vh] place-items-center bg-[radial-gradient(circle_at_top_left,#fde68a,#f9a8d4_42%,#93c5fd)] p-8 text-center">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.32em] text-slate-900/60">
                      PHOTO_ITEMS
                    </p>
                    <p className="mt-3 text-3xl font-black text-slate-950">
                      Chỗ này chờ ảnh thật
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            <div className="space-y-2 p-4 text-slate-900 sm:p-6">
              {categoryLabel && (
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-rose-500">
                  {categoryLabel}
                </p>
              )}

              <p className="text-base font-semibold leading-relaxed sm:text-lg">
                {photo.caption}
              </p>

              {canNavigate && (
                <div className="grid grid-cols-2 gap-3 pt-3 md:hidden">
                  <button
                    type="button"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 font-black text-white shadow-lg transition active:scale-95 focus:outline-none focus:ring-4 focus:ring-rose-200"
                    onClick={onPrevious}
                  >
                    <ChevronLeft size={20} />
                    Trước
                  </button>

                  <button
                    type="button"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-rose-500 px-4 font-black text-white shadow-lg shadow-rose-500/20 transition active:scale-95 focus:outline-none focus:ring-4 focus:ring-rose-200"
                    onClick={onNext}
                  >
                    Sau
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}