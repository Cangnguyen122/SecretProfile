import { AnimatePresence, motion } from "framer-motion";
import { LockOpen, ShieldCheck } from "lucide-react";
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
  "Ủa? Bấm hụt hả?",
  "Chậm quá nha, hồ sơ né được luôn.",
  "Có nhân chứng nói bạn vừa trượt tay.",
  "Hệ thống nghi ngờ kỹ năng click.",
  "Meme mới vừa được anh em gửi tới.",
  "Bằng chứng đang chạy nhanh hơn bạn.",
  "Bí mật chưa dễ mở vậy đâu.",
  "Rồi đó, đủ thủ tục troll rồi.",
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
  const gap = 28;
  return !(
    first.x + firstSize.width + gap < second.x ||
    second.x + secondSize.width + gap < first.x ||
    first.y + firstSize.height + gap < second.y ||
    second.y + secondSize.height + gap < first.y
  );
}

export function RunawayButtonRevealSection({ onUnlocked }: RunawayButtonRevealSectionProps) {
  const playgroundRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [dodges, setDodges] = useState(0);
  const [buttonPosition, setButtonPosition] = useState<FloatingBox | null>(null);
  const [stickerPosition, setStickerPosition] = useState<FloatingBox | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  const canDodge = dodges < maxDodges;
  const buttonText = canDodge ? "Mở hồ sơ tuyệt mật" : "Rồi bấm đi, cho xem thật nè.";
  const activeSticker =
    dodges > 0 && birthdayConfig.runawayStickers.length > 0
      ? birthdayConfig.runawayStickers[(dodges - 1) % birthdayConfig.runawayStickers.length]
      : null;
  const activeMessage = dodges > 0 ? trollMessages[(dodges - 1) % trollMessages.length] : null;
  const activeStickerRotation = dodges > 0 ? stickerRotations[(dodges - 1) % stickerRotations.length] : 0;
  const activeEvidenceLabel = dodges > 0 ? evidenceLabels[(dodges - 1) % evidenceLabels.length] : null;

  function createRandomLayout(includeSticker: boolean) {
    if (!playgroundRef.current) return null;
    const rect = playgroundRef.current.getBoundingClientRect();
    const buttonRect = buttonRef.current?.getBoundingClientRect();
    const safePadding = rect.width < 640 ? 16 : 30;
    const buttonWidth = buttonRect?.width ?? 330;
    const buttonHeight = buttonRect?.height ?? 64;
    const cardWidth = Math.min(rect.width - safePadding * 2, rect.width < 640 ? 330 : 560);
    const cardHeight = rect.width < 640 ? 136 : 172;
    const buttonSize = { width: buttonWidth, height: buttonHeight };
    const cardSize = { width: cardWidth, height: cardHeight };

    const maxButtonX = Math.max(safePadding, rect.width - buttonWidth - safePadding);
    const maxButtonY = Math.max(safePadding, rect.height - buttonHeight - safePadding);
    const maxCardX = Math.max(safePadding, rect.width - cardWidth - safePadding);
    const maxCardY = Math.max(safePadding, rect.height - cardHeight - safePadding);

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
      document.getElementById("emotional-reveal")?.scrollIntoView({ behavior: "smooth" });
    }, 1100);
  }

  return (
    <section
      id="runaway"
      className="relative flex min-h-screen flex-col overflow-hidden bg-[#101624] px-4 py-6 text-white sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(236,72,153,0.22),transparent_32%),radial-gradient(circle_at_82%_8%,rgba(56,189,248,0.18),transparent_30%),linear-gradient(145deg,#101624,#182233)]" />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col">
        <header className="grid gap-4 pt-4 text-center sm:pt-8">
          <p className="mx-auto rounded-full border border-cyan-200/20 bg-cyan-200/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-100">
            Kiểm tra quyền truy cập
          </p>
          <h2 className="mx-auto max-w-4xl font-display text-3xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Bạn có chắc muốn mở hồ sơ sinh nhật tuyệt mật không?
          </h2>
        </header>

        <div
          ref={playgroundRef}
          className="relative mt-5 min-h-[64vh] flex-1 overflow-hidden rounded-[34px] border border-white/12 bg-slate-950/34 shadow-2xl ring-1 ring-white/8 sm:mt-7"
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <span className="pointer-events-none absolute left-4 top-4 h-11 w-11 rounded-tl-3xl border-l border-t border-cyan-100/35" />
          <span className="pointer-events-none absolute right-4 top-4 h-11 w-11 rounded-tr-3xl border-r border-t border-cyan-100/35" />
          <span className="pointer-events-none absolute bottom-4 left-4 h-11 w-11 rounded-bl-3xl border-b border-l border-cyan-100/35" />
          <span className="pointer-events-none absolute bottom-4 right-4 h-11 w-11 rounded-br-3xl border-b border-r border-cyan-100/35" />

          {dodges === 0 && (
            <motion.div
              className="pointer-events-none absolute left-1/2 top-[22%] w-[min(82vw,520px)] -translate-x-1/2 rounded-[30px] border border-dashed border-cyan-100/18 bg-white/[0.035] p-6 text-center text-sm font-black uppercase tracking-[0.22em] text-cyan-100/55"
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
                  className="pointer-events-none absolute z-20 flex w-[calc(100%-32px)] max-w-[560px] items-center gap-3 rounded-[30px] border border-cyan-200/18 bg-slate-950/82 p-3 pr-4 text-left shadow-2xl shadow-rose-500/18 ring-1 ring-white/10 backdrop-blur-md sm:gap-5 sm:p-4 sm:pr-6"
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
                  exit={{ opacity: 0, scale: 0.72, y: stickerPosition.y - 18 }}
                  transition={{ type: "spring", stiffness: 520, damping: 28 }}
                >
                  <motion.img
                    key={activeSticker.src}
                    src={activeSticker.src}
                    alt={activeSticker.alt}
                    className="h-20 w-20 shrink-0 select-none rounded-2xl object-contain drop-shadow-2xl sm:h-28 sm:w-28"
                    draggable={false}
                    initial={{ rotate: -12, scale: 0.8 }}
                    animate={{ rotate: [0, -5, 4, 0], scale: [1, 1.08, 1] }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                  <div className="min-w-0">
                    <span className="inline-flex rounded-full bg-amber-300 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-slate-950 shadow-lg sm:text-xs">
                      {activeEvidenceLabel}
                    </span>
                    <p className="mt-2 text-base font-black leading-6 text-amber-100 sm:text-lg sm:leading-7">
                      {activeMessage}
                    </p>
                  </div>
                </motion.div>
              )}
          </AnimatePresence>

          <motion.button
            ref={buttonRef}
            type="button"
            className="absolute left-0 top-0 z-30 inline-flex min-h-14 w-[min(74vw,330px)] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-300 via-rose-300 to-fuchsia-400 px-6 py-4 text-center font-black text-slate-950 shadow-glow transition focus:outline-none focus:ring-4 focus:ring-amber-200"
            style={{ visibility: buttonPosition ? "visible" : "hidden" }}
            animate={buttonPosition ? { x: buttonPosition.x, y: buttonPosition.y } : { x: 0, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22, mass: 0.76 }}
            onClick={handleClick}
          >
            <LockOpen size={19} />
            {buttonText}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {unlocked && (
          <motion.div
            className="absolute inset-0 z-40 grid place-items-center bg-slate-950/94 p-5 text-center backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="max-w-2xl">
              <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-emerald-300 text-slate-950 shadow-neon">
                <ShieldCheck size={30} />
              </div>
              <p className="font-display text-4xl font-black text-emerald-200 sm:text-6xl">
                <GlitchText>TRUY CẬP THÀNH CÔNG</GlitchText>
              </p>
              <p className="mt-5 text-lg font-semibold leading-8 text-slate-200">
                Bạn vừa vượt qua bài kiểm tra kiên nhẫn. Hồ sơ chính thức được mở.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
