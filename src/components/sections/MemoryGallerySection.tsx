import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ImageIcon, Maximize2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { birthdayConfig, type PhotoCategory, type PhotoItem } from "../../data/birthdayConfig";
import { PhotoLightbox } from "../ui/PhotoLightbox";
import { SectionWrapper } from "../ui/SectionWrapper";

const albumOrder: PhotoCategory[] = ["cute", "couple", "funny", "memory"];
const visibleStackCount = 4;

function wrapIndex(index: number, length: number) {
  if (length === 0) return 0;
  return (index + length) % length;
}

export function MemoryGallerySection() {
  const [selectedAlbum, setSelectedAlbum] = useState<PhotoCategory>("cute");
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  const albumCounts = useMemo(() => {
    return albumOrder.reduce(
      (counts, album) => ({
        ...counts,
        [album]: birthdayConfig.photoItems.filter((photo) => photo.category === album).length,
      }),
      {} as Record<PhotoCategory, number>,
    );
  }, []);

  const albumPhotos = useMemo(
    () => birthdayConfig.photoItems.filter((photo) => photo.category === selectedAlbum),
    [selectedAlbum],
  );
  const activePhoto = albumPhotos[activeIndex] ?? null;
  const backCards = useMemo(() => {
    return Array.from(
      { length: Math.max(0, Math.min(visibleStackCount, albumPhotos.length) - 1) },
      (_, index) => {
        const offset = index + 1;
        return {
          photo: albumPhotos[wrapIndex(activeIndex + offset, albumPhotos.length)],
          offset,
        };
      },
    );
  }, [activeIndex, albumPhotos]);

  useEffect(() => {
    setActiveIndex(0);
    setDirection(1);
  }, [selectedAlbum]);

  function selectAlbum(album: PhotoCategory) {
    setSelectedAlbum(album);
  }

  function goToNext() {
    if (albumPhotos.length <= 1) return;
    setDirection(1);
    setActiveIndex((current) => wrapIndex(current + 1, albumPhotos.length));
  }

  function goToPrevious() {
    if (albumPhotos.length <= 1) return;
    setDirection(-1);
    setActiveIndex((current) => wrapIndex(current - 1, albumPhotos.length));
  }

  function jumpToPhoto(index: number) {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  }

  const albumTabs = (
    <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {albumOrder.map((album) => {
        const isActive = selectedAlbum === album;

        return (
          <button
            key={album}
            type="button"
            className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-rose-200 ${
              isActive
                ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                : "bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-rose-50"
            }`}
            onClick={() => selectAlbum(album)}
          >
            <span>{birthdayConfig.galleryCategories[album]}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                isActive ? "bg-white/22 text-white" : "bg-slate-100 text-slate-500"
              }`}
            >
              {albumCounts[album]}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <SectionWrapper id="gallery" className="!overflow-visible bg-[#f7fbff] text-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-black uppercase tracking-[0.22em] text-white">
              <ImageIcon size={16} /> Memory gallery
            </p>
            <h2 className="mt-5 max-w-2xl font-display text-3xl font-black leading-tight sm:text-5xl">
              Bằng chứng hình ảnh trong hồ sơ
            </h2>
          </div>
          <div className="rounded-full bg-white px-4 py-2 text-sm font-black text-slate-500 shadow-sm">
            {birthdayConfig.galleryCategories[selectedAlbum]} · {albumPhotos.length} ảnh
          </div>
        </div>

        <div className="sticky top-1 z-30 -mx-4 mb-5 border-y border-slate-200/70 bg-[#f7fbff]/94 px-4 py-2.5 shadow-sm backdrop-blur lg:hidden">
          {albumTabs}
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start xl:gap-12">
          <aside className="sticky top-6 hidden rounded-[26px] border border-slate-200 bg-white/88 p-4 shadow-xl shadow-slate-900/8 lg:block">
            <p className="px-2 text-xs font-black uppercase tracking-[0.26em] text-rose-500">
              Chọn xấp ảnh
            </p>
            <div className="mt-4 grid gap-2">
              {albumOrder.map((album) => {
                const isActive = selectedAlbum === album;

                return (
                  <button
                    key={album}
                    type="button"
                    className={`flex min-h-14 items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left font-black transition focus:outline-none focus:ring-4 focus:ring-rose-200 ${
                      isActive
                        ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                        : "bg-slate-50 text-slate-800 hover:bg-rose-50"
                    }`}
                    onClick={() => selectAlbum(album)}
                  >
                    <span>{birthdayConfig.galleryCategories[album]}</span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${
                        isActive ? "bg-white/22 text-white" : "bg-white text-slate-500"
                      }`}
                    >
                      {albumCounts[album]}
                    </span>
                  </button>
                );
              })}
            </div>

            {activePhoto && (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                  Ảnh {String(activeIndex + 1).padStart(2, "0")} /{" "}
                  {String(albumPhotos.length).padStart(2, "0")}
                </p>
                <p className="mt-3 text-base font-semibold leading-7 text-slate-700">
                  {activePhoto.caption}
                </p>
              </div>
            )}
          </aside>

          <div className="min-w-0">
            <div className="mb-5 flex items-center justify-between gap-3 rounded-[24px] border border-slate-200 bg-white/78 p-3 shadow-sm lg:bg-transparent lg:p-0 lg:shadow-none lg:border-0">
              <div className="min-w-0">
                <p className="truncate text-sm font-black uppercase tracking-[0.2em] text-rose-500">
                  {birthdayConfig.galleryCategories[selectedAlbum]}
                </p>
                <p className="mt-1 text-2xl font-black text-slate-950">
                  {String(activeIndex + 1).padStart(2, "0")} /{" "}
                  {String(albumPhotos.length).padStart(2, "0")}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  className="grid h-11 w-11 place-items-center rounded-full bg-slate-950 text-white shadow-lg transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-rose-200 disabled:cursor-not-allowed disabled:opacity-35"
                  onClick={goToPrevious}
                  disabled={albumPhotos.length <= 1}
                  aria-label="Xem ảnh trước"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  className="grid h-11 w-11 place-items-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/20 transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-rose-200 disabled:cursor-not-allowed disabled:opacity-35"
                  onClick={goToNext}
                  disabled={albumPhotos.length <= 1}
                  aria-label="Xem ảnh tiếp theo"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-rose-400 via-fuchsia-400 to-sky-400"
                animate={{
                  width: `${
                    albumPhotos.length ? ((activeIndex + 1) / albumPhotos.length) * 100 : 0
                  }%`,
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            </div>

            <div className="relative mx-auto mt-6 w-full max-w-[460px] pb-8 sm:max-w-[540px] sm:pb-12 xl:max-w-[600px]">
              <div className="absolute inset-x-6 bottom-6 top-8 rounded-[34px] bg-slate-900/8 blur-2xl" />

              {backCards
                .slice()
                .reverse()
                .map(({ photo, offset }) => (
                  <motion.div
                    key={`${selectedAlbum}-${photo.id}-${activeIndex}-${offset}`}
                    className="pointer-events-none absolute inset-x-2 top-0 overflow-hidden rounded-[28px] border border-white bg-white p-3 shadow-2xl shadow-slate-900/12 sm:inset-x-7"
                    style={{ zIndex: visibleStackCount - offset }}
                    animate={{
                      x: offset * 10,
                      y: offset * 14,
                      rotate: offset % 2 === 0 ? -2 + offset : 2 + offset,
                      scale: 1 - offset * 0.045,
                      opacity: 1 - offset * 0.14,
                    }}
                    transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  >
                    <div className="aspect-[4/5] overflow-hidden rounded-[22px] bg-slate-100">
                      {photo.src ? (
                        <img
                          src={photo.src}
                          alt=""
                          className="block h-full w-full object-cover"
                          loading="lazy"
                          draggable={false}
                        />
                      ) : (
                        <div className="h-full bg-[linear-gradient(135deg,#fecdd3,#fde68a_45%,#bfdbfe)]" />
                      )}
                    </div>
                  </motion.div>
                ))}

              {activePhoto && (
                <motion.button
                  key={`${selectedAlbum}-${activePhoto.id}-${activeIndex}`}
                  type="button"
                  className="relative z-20 block w-full overflow-hidden rounded-[28px] border border-white bg-white p-3 text-left shadow-2xl shadow-slate-900/16 focus:outline-none focus:ring-4 focus:ring-rose-200 sm:mx-7 sm:w-[calc(100%-3.5rem)]"
                  initial={{ x: direction * 80, y: 16, rotate: direction * 7, opacity: 0 }}
                  animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.22}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -70) goToNext();
                    if (info.offset.x > 70) goToPrevious();
                  }}
                  onClick={() => setSelectedPhoto(activePhoto)}
                  aria-label={`Mở ảnh: ${activePhoto.caption}`}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-slate-100">
                    {activePhoto.src ? (
                      <img
                        src={activePhoto.src}
                        alt={activePhoto.alt}
                        className="block h-full w-full object-cover"
                        loading="eager"
                        draggable={false}
                      />
                    ) : (
                      <div className="grid h-full place-items-center bg-[linear-gradient(135deg,#fecdd3,#fde68a_45%,#bfdbfe)] p-6 text-center">
                        <p className="font-display text-2xl font-black text-slate-950">
                          Ảnh chờ thay
                        </p>
                      </div>
                    )}
                    <div className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-slate-900 shadow-lg">
                      {String(activeIndex + 1).padStart(2, "0")}
                    </div>
                    <div className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-slate-950/75 text-white shadow-lg backdrop-blur">
                      <Maximize2 size={18} />
                    </div>
                  </div>
                </motion.button>
              )}
            </div>

            {activePhoto && (
              <div className="mx-auto -mt-2 max-w-[500px] rounded-[22px] border border-slate-200 bg-white/82 p-4 shadow-sm lg:hidden">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                  Ghi chú ảnh
                </p>
                <p className="mt-2 text-base font-semibold leading-7 text-slate-700">
                  {activePhoto.caption}
                </p>
              </div>
            )}

            <div className="mx-auto mt-4 flex max-w-[600px] gap-2 overflow-x-auto pb-2">
              {albumPhotos.map((photo, index) => (
                <button
                  key={photo.id}
                  type="button"
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 transition focus:outline-none focus:ring-4 focus:ring-rose-200 ${
                    activeIndex === index
                      ? "border-rose-500 shadow-lg shadow-rose-500/20"
                      : "border-white opacity-70 hover:opacity-100"
                  }`}
                  onClick={() => jumpToPhoto(index)}
                  aria-label={`Chuyển tới ảnh ${index + 1}`}
                >
                  <img
                    src={photo.src}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <PhotoLightbox
        photo={selectedPhoto}
        categoryLabel={
          selectedPhoto ? birthdayConfig.galleryCategories[selectedPhoto.category] : undefined
        }
        onClose={() => setSelectedPhoto(null)}
      />
    </SectionWrapper>
  );
}
