import { AnimatePresence, motion } from "framer-motion";
import { FileWarning, LockOpen, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { birthdayConfig } from "../../data/birthdayConfig";
import { GlitchText } from "../ui/GlitchText";

const maxDodges = 8;
const stickerRotations = [-4, 3, -2, 4, -3, 2, -5, 3];
const evidenceLabels = [
  "Bằng chứng mới",
  "Anh em vừa gửi",
  "Bí mật bị lộ",
  "Hồ sơ cập nhật",
  "Tang chứng troll",
  "Nguồn tin nóng",
  "Nhân chứng xuất hiện",
  "Sắp mở khóa",
];
const trollMessages = [
  "Ủa? Bấm hụt hả? 🙊",
  "Chậm quá nha, thử lại xem",
  "Có nhân chứng nói bạn vừa trượt tay.",
  "Hệ thống nghi ngờ kỹ năng click. 😜",
  "Đánh giá thấp vua bầu trời á nha. 😏",
  "Fishee có hỗ trợ nhưng không đáng kể 😄.",
  "Bí mật chưa dễ mở vậy đâu.",
  "Bạn nghĩ đã mở được hay chưa? 😆",
];

type RunawayButtonRevealSectionProps = {
  onUnlocked: () => void;
};

type FloatingBox = {
  x: number;
  y: number;
};

function randomBetween(min: number, max: number) {
  if (max <= min) return min;
  return min + Math.random() * (max - min);
}

function overlaps(
  first: FloatingBox,
  firstSize: { width: number; height: number },
  second: FloatingBox,
  secondSize: { width: number; height: number },
) {
  const gap = 24;
  return !(
    first.x + firstSize.width + gap < second.x ||
    second.x + secondSize.width + gap < first.x ||
    first.y + firstSize.height + gap < second.y ||
    second.y + secondSize.height + gap < first.y
  );
}

export function RunawayButtonRevealSection({
  onUnlocked,
}: RunawayButtonRevealSectionProps) {
  const playgroundRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [dodges, setDodges] = useState(0);
  const [buttonPosition, setButtonPosition] = useState<FloatingBox | null>(
    null,
  );
  const [stickerPosition, setStickerPosition] = useState<FloatingBox | null>(
    null,
  );
  const [unlocked, setUnlocked] = useState(false);

  const canDodge = dodges < maxDodges;
  const buttonText = canDodge ? "Mở hồ sơ tuyệt mật" : "Mở hồ sơ tuyệt mật";
  const activeSticker =
    dodges > 0 && birthdayConfig.runawayStickers.length > 0
      ? birthdayConfig.runawayStickers[
          (dodges - 1) % birthdayConfig.runawayStickers.length
        ]
      : null;
  const activeMessage =
    dodges > 0 ? trollMessages[(dodges - 1) % trollMessages.length] : null;
  const activeStickerRotation =
    dodges > 0 ? stickerRotations[(dodges - 1) % stickerRotations.length] : 0;
  const activeEvidenceLabel =
    dodges > 0 ? evidenceLabels[(dodges - 1) % evidenceLabels.length] : null;

  function createRandomLayout(includeSticker: boolean) {
    if (!playgroundRef.current) return null;
    const rect = playgroundRef.current.getBoundingClientRect();
    const buttonRect = buttonRef.current?.getBoundingClientRect();
    const safePadding = rect.width < 640 ? 16 : 28;
    const buttonWidth = buttonRect?.width ?? 310;
    const buttonHeight = buttonRect?.height ?? 56;
    const cardWidth = Math.min(
      rect.width - safePadding * 2,
      rect.width < 640 ? 320 : 520,
    );
    const cardHeight = rect.width < 640 ? 126 : 148;
    const buttonSize = { width: buttonWidth, height: buttonHeight };
    const cardSize = { width: cardWidth, height: cardHeight };

    const maxButtonX = Math.max(
      safePadding,
      rect.width - buttonWidth - safePadding,
    );
    const maxButtonY = Math.max(
      safePadding,
      rect.height - buttonHeight - safePadding,
    );
    const maxCardX = Math.max(
      safePadding,
      rect.width - cardWidth - safePadding,
    );
    const maxCardY = Math.max(
      safePadding,
      rect.height - cardHeight - safePadding,
    );

    let nextButton = {
      x: randomBetween(safePadding, maxButtonX),
      y: randomBetween(safePadding, maxButtonY),
    };
    let nextSticker = {
      x: randomBetween(safePadding, maxCardX),
      y: randomBetween(safePadding, maxCardY),
    };

    if (!includeSticker) return { button: nextButton, sticker: null };

    for (let attempt = 0; attempt < 30; attempt += 1) {
      const candidateButton = {
        x: randomBetween(safePadding, maxButtonX),
        y: randomBetween(safePadding, maxButtonY),
      };
      const candidateSticker = {
        x: randomBetween(safePadding, maxCardX),
        y: randomBetween(safePadding, maxCardY),
      };

      if (!overlaps(candidateButton, buttonSize, candidateSticker, cardSize)) {
        nextButton = candidateButton;
        nextSticker = candidateSticker;
        break;
      }
    }

    return { button: nextButton, sticker: nextSticker };
  }

  useEffect(() => {
    if (buttonPosition || unlocked) return;

    const frame = window.requestAnimationFrame(() => {
      const layout = createRandomLayout(false);
      if (layout) setButtonPosition(layout.button);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [buttonPosition, unlocked]);

  function dodgeButton() {
    if (!canDodge) return;

    const nextIndex = dodges + 1;
    const layout = createRandomLayout(true);
    if (!layout) return;

    setButtonPosition(layout.button);
    setStickerPosition(layout.sticker);
    setDodges(nextIndex);
  }

  function handleClick() {
    if (canDodge) {
      dodgeButton();
      return;
    }

    setButtonPosition(null);
    setStickerPosition(null);
    setUnlocked(true);
    onUnlocked();

    window.setTimeout(() => {
      document
        .getElementById("emotional-reveal")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 1100);
  }

  return (
    <section
      id="runaway"
      className="case-board relative flex min-h-screen flex-col overflow-y-auto overflow-x-hidden p-3 text-stone-950 sm:p-4 lg:h-screen lg:overflow-hidden"
    >
      <div className="relative z-10 flex min-h-[calc(100vh-1.5rem)] w-full items-center lg:h-full lg:min-h-0">
        <div className="investigation-board intro-board relative flex min-h-[calc(100vh-1.5rem)] w-full flex-col overflow-visible rounded-[8px] border border-amber-950/50 p-4 sm:p-5 lg:h-full lg:min-h-0 lg:overflow-hidden lg:p-6">
          <header className="paper-slip relative mx-auto w-full max-w-4xl px-4 py-3 text-center sm:px-5 sm:py-4">
            <span className="pin pin-left" />
            <span className="pin pin-right" />
            <h2 className="mx-auto max-w-3xl font-display text-2xl font-black uppercase leading-tight tracking-[0.06em] text-stone-950 sm:text-4xl lg:text-5xl">
              Bạn có chắc muốn mở hồ sơ sinh nhật tuyệt mật không?
            </h2>
          </header>

          <div
            ref={playgroundRef}
            className="case-file-card relative mt-4 min-h-[420px] flex-1 overflow-hidden p-4 shadow-2xl sm:min-h-[50vh] lg:min-h-0"
          >
            <span className="pin pin-top" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(68,41,16,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(68,41,16,0.07)_1px,transparent_1px)] bg-[size:42px_42px]" />
            <span className="pointer-events-none absolute left-4 top-4 h-10 w-10 border-l-2 border-t-2 border-red-900/40" />
            <span className="pointer-events-none absolute right-4 top-4 h-10 w-10 border-r-2 border-t-2 border-red-900/40" />
            <span className="pointer-events-none absolute bottom-4 left-4 h-10 w-10 border-b-2 border-l-2 border-red-900/40" />
            <span className="pointer-events-none absolute bottom-4 right-4 h-10 w-10 border-b-2 border-r-2 border-red-900/40" />

            {dodges === 0 && (
              <motion.div
                className="pointer-events-none absolute left-1/2 top-[18%] w-[min(82vw,480px)] -translate-x-1/2 border-2 border-dashed border-stone-900/25 bg-[#d6c19b]/60 p-5 text-center font-mono text-xs font-black uppercase tracking-[0.18em] text-stone-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Hồ sơ đang khóa
              </motion.div>
            )}

            <AnimatePresence initial={false}>
              {dodges > 0 &&
                !unlocked &&
                activeSticker &&
                activeMessage &&
                activeEvidenceLabel &&
                stickerPosition && (
                  <motion.div
                    key={dodges}
                    className="pointer-events-none absolute z-20 flex w-[calc(100%-32px)] max-w-[520px] items-center gap-3 border border-stone-900/30 bg-[#d6c19b] p-3 pr-4 text-left shadow-2xl sm:gap-4"
                    initial={{
                      opacity: 1,
                      x: stickerPosition.x,
                      y: stickerPosition.y,
                      scale: 0.96,
                      rotate: activeStickerRotation,
                    }}
                    animate={{
                      opacity: 1,
                      x: stickerPosition.x,
                      y: stickerPosition.y,
                      scale: 1,
                      rotate: activeStickerRotation,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.72,
                      y: stickerPosition.y - 18,
                    }}
                    transition={{ type: "spring", stiffness: 520, damping: 28 }}
                  >
                    <motion.img
                      key={activeSticker.src}
                      src={activeSticker.src}
                      alt={activeSticker.alt}
                      className="h-16 w-16 shrink-0 select-none object-contain drop-shadow-2xl sm:h-24 sm:w-24"
                      draggable={false}
                      initial={{ rotate: -12, scale: 0.8 }}
                      animate={{ rotate: [0, -5, 4, 0], scale: [1, 1.08, 1] }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    />
                    <div className="min-w-0">
                      <span className="inline-flex bg-red-800 px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-amber-50 sm:text-xs">
                        {activeEvidenceLabel}
                      </span>
                      <p className="mt-2 font-display text-base font-black leading-6 text-stone-950 sm:text-lg">
                        {activeMessage}
                      </p>
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>

            <motion.button
              ref={buttonRef}
              type="button"
              className="absolute left-0 top-0 z-30 inline-flex min-h-12 w-[min(74vw,310px)] items-center justify-center gap-2 bg-stone-950 px-5 py-3 text-center font-display text-sm font-black uppercase tracking-[0.06em] text-amber-100 shadow-xl transition focus:outline-none focus:ring-4 focus:ring-red-900/30"
              style={{ visibility: buttonPosition ? "visible" : "hidden" }}
              animate={
                buttonPosition
                  ? { x: buttonPosition.x, y: buttonPosition.y }
                  : { x: 0, y: 0 }
              }
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 22,
                mass: 0.76,
              }}
              onClick={handleClick}
            >
              <LockOpen size={18} />
              {buttonText}
            </motion.button>
          </div>

          <p className="absolute bottom-4 right-4 hidden border border-amber-200/20 bg-stone-950/70 px-3 py-2 font-mono text-xs font-black uppercase tracking-[0.16em] text-amber-100 lg:block">
            Bước 03 / Xác minh lần cuối
          </p>
        </div>
      </div>

      <AnimatePresence>
        {unlocked && (
          <motion.div
            className="absolute inset-0 z-40 grid place-items-center bg-stone-950/94 p-5 text-center backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="paper-slip relative max-w-2xl p-6">
              <span className="pin pin-left" />
              <span className="pin pin-right" />
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-stone-950 text-amber-100">
                <ShieldCheck size={30} />
              </div>
              <p className="font-display text-4xl font-black uppercase text-red-900 sm:text-5xl">
                <GlitchText>TRUY CẬP THÀNH CÔNG</GlitchText>
              </p>
              <p className="mt-4 font-mono text-sm font-black uppercase leading-6 text-stone-800">
                Bạn vừa vượt qua bài kiểm tra kiên nhẫn. Hồ sơ chính thức được
                mở.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
