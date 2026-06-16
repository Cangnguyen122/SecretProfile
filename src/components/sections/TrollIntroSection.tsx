import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  FileWarning,
  Fingerprint,
  ShieldAlert,
  Siren,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useState } from "react";
import { birthdayConfig } from "../../data/birthdayConfig";

type TrollIntroSectionProps = {
  isMusicOn: boolean;
  onContinue: () => void;
  onToggleMusic: () => void;
};

const suspectProfiles = [
  {
    id: "01",
    caseId: "BD-17-06-A",
    name: birthdayConfig.personA.name,
    alias: "Người phát tín hiệu hòa bình",
    charge: "Cười quá tươi, gây thương nhớ diện rộng",
    evidence: "Nón Minnie, kính đen tròn, biểu cảm đáng nghi",
    src: "/assets/suspect-ny.jpeg",
    imagePosition: "center 24%",
    rotate: "-rotate-2 lg:-rotate-3",
    stamp: "NGHI PHẠM 01",
  },
  {
    id: "02",
    caseId: "BD-19-06-B",
    name: birthdayConfig.personB.name,
    alias: "Đồng phạm hai tay chữ V",
    charge: "Phối hợp tạo tim, phát tán năng lượng vui vẻ",
    evidence: "Nụ cười khả nghi, hai tay chữ V, ánh mắt vô tội",
    src: "/assets/suspect-trung.jpeg",
    imagePosition: "center 20%",
    rotate: "rotate-2",
    stamp: "NGHI PHẠM 02",
  },
] as const;

export function TrollIntroSection({
  isMusicOn,
  onContinue,
  onToggleMusic,
}: TrollIntroSectionProps) {
  const [showBoard, setShowBoard] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowBoard(true), 4000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="case-board intro-one-page relative min-h-[100svh] overflow-x-hidden overflow-y-auto p-3 text-stone-950 sm:p-4 lg:h-[100svh] lg:overflow-hidden">
      <button
        type="button"
        className="absolute right-4 top-4 z-40 grid h-11 w-11 place-items-center rounded-full border border-amber-100/25 bg-stone-950/72 text-amber-100 shadow-lg backdrop-blur transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-amber-200/40"
        aria-label={isMusicOn ? "Tắt âm thanh phóng sự" : "Bật âm thanh phóng sự"}
        aria-pressed={isMusicOn}
        title={isMusicOn ? "Tắt âm thanh phóng sự" : "Bật âm thanh phóng sự"}
        onClick={onToggleMusic}
      >
        {isMusicOn ? <Volume2 size={19} /> : <VolumeX size={19} />}
      </button>

      <AnimatePresence>
        {!showBoard && (
          <motion.div
            className="warning-gate warning-red-flash fixed inset-0 z-50 grid place-items-center px-5 text-center text-red-100"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.42, ease: "easeOut" }}
          >
            <div className="warning-scanlines absolute inset-0" aria-hidden="true" />
            <div className="warning-flash-layer absolute inset-0" aria-hidden="true" />

            <motion.div
              className="warning-panel relative w-full max-w-3xl p-5 sm:p-8"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.38 }}
            >
              <div className="warning-beacon mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-red-950/70 text-red-100">
                <Siren size={32} />
              </div>

              <p className="warning-pulse font-display text-4xl font-black uppercase tracking-[0.12em] text-red-500 sm:text-6xl">
                Warning
              </p>

              <p className="mt-2 font-display text-2xl font-black uppercase tracking-[0.08em] text-amber-100 sm:text-4xl">
                Nội dung nguy hiểm
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="intro-stage-shell relative z-10 mx-auto flex min-h-[calc(100svh-1.5rem)] w-full items-center justify-center py-8 sm:min-h-[calc(100svh-2rem)] lg:py-0">
        <motion.div
          className="investigation-board intro-board intro-stage intro-board-fit relative w-full overflow-hidden rounded-[8px] border border-amber-950/50 p-3 sm:p-4 lg:p-5"
          initial={{ opacity: 0, scale: 0.98, y: 18 }}
          animate={showBoard ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.98, y: 18 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <div className="absolute left-[8%] top-[21%] hidden h-[2px] w-[39%] rotate-[9deg] bg-red-800/75 shadow-[0_0_8px_rgba(127,29,29,0.7)] sm:block" />
          <div className="absolute right-[10%] top-[24%] hidden h-[2px] w-[35%] -rotate-[11deg] bg-red-800/75 shadow-[0_0_8px_rgba(127,29,29,0.7)] sm:block" />
          <div className="absolute left-[24%] top-[46%] hidden h-[2px] w-[52%] -rotate-[3deg] bg-red-800/70 shadow-[0_0_8px_rgba(127,29,29,0.65)] lg:block" />
          <div className="absolute left-[38%] top-[18%] hidden h-[2px] w-[24%] rotate-[86deg] bg-red-800/60 xl:block" />

          <div className="intro-case-grid grid h-full gap-3 lg:grid-cols-[0.95fr_1.14fr_0.95fr] lg:grid-rows-[0.62fr_1.95fr_0.72fr] lg:items-start xl:gap-4">
            <motion.div
              className="paper-slip intro-title-card relative mx-auto w-full max-w-[420px] px-3 py-2 text-center sm:max-w-[470px] lg:col-start-2 lg:self-end lg:translate-y-4 xl:translate-y-6"
              initial={{ opacity: 0, y: -18, rotate: -1 }}
              animate={{ opacity: 1, y: 0, rotate: -1 }}
              transition={{ delay: 0.08, duration: 0.45 }}
            >
              <span className="pin pin-left" />
              <span className="pin pin-right" />

              <p className="mb-1 inline-flex items-center gap-2 bg-red-800 px-3 py-1 font-mono text-[9px] font-black uppercase tracking-[0.18em] text-amber-50 sm:text-[10px]">
                <ShieldAlert size={14} />
                CASE #BD-LOVE-02
              </p>

              <h1 className="intro-title font-display text-[clamp(1.85rem,4vw,4.35rem)] font-black uppercase leading-[0.98] tracking-[0.07em] text-stone-950">
                Hồ Sơ Mật
                <span className="block">Vụ Án Sinh Nhật</span>
              </h1>

              <div className="mx-auto mt-2 w-fit border-2 border-red-800/80 px-4 py-1 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-red-900 sm:text-xs lg:text-sm">
                Cực kỳ đáng yêu
              </div>
            </motion.div>

            <motion.div
              className="sticky-note left-note hidden rotate-[-5deg] p-3 font-mono text-xs font-black uppercase leading-5 xl:block"
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18, duration: 0.4 }}
            >
              Cẩn thận:
              <br />
              Nụ cười gây
              <br />
              thương nhớ
              <br />
              diện rộng!
            </motion.div>

            <motion.div
              className="sticky-note right-note hidden rotate-[4deg] p-3 font-mono text-xs font-black uppercase leading-5 xl:block"
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              Bị tình nghi
              <br />
              quá đáng yêu!
            </motion.div>

            {suspectProfiles.map((suspect, index) => (
              <motion.article
                key={suspect.caseId}
                className={`case-file-card intro-suspect-card relative ${suspect.rotate} lg:row-start-2 ${
                  index === 0 ? "lg:col-start-1 lg:self-end" : "lg:col-start-3 lg:self-end"
                }`}
                initial={{ opacity: 0, y: 24, rotate: index === 0 ? -5 : 5 }}
                animate={{ opacity: 1, y: 0, rotate: index === 0 ? -3 : 2 }}
                transition={{ delay: 0.2 + index * 0.08, duration: 0.5 }}
              >
                <span className="pin pin-top" />

                <div className="mugshot intro-photo-frame intro-suspect-photo relative overflow-hidden border border-stone-900/30 bg-stone-800">
                  <img
                    src={suspect.src}
                    alt={`Ảnh hồ sơ tình nghi của ${suspect.name}`}
                    className="relative z-0 h-full w-full object-cover sepia-[0.08]"
                    style={{ objectPosition: suspect.imagePosition }}
                    draggable={false}
                  />
                  <div className="absolute inset-0 z-20 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),rgba(41,25,14,0.08))]" />
                </div>

                <div className="px-3 pb-3 pt-2">
                  <p className="mb-2 border-y border-stone-900/45 py-1 font-display text-base font-black uppercase tracking-[0.08em] text-red-900 sm:text-lg">
                    {suspect.stamp}
                  </p>

                  <dl className="intro-card-text space-y-1.5 font-mono text-[10px] font-black uppercase leading-4 text-stone-950">
                    <div>
                      <dt className="text-stone-600">Bí danh:</dt>
                      <dd>“{suspect.alias}”</dd>
                    </div>

                    <div>
                      <dt className="text-stone-600">Tội danh:</dt>
                      <dd>{suspect.charge}</dd>
                    </div>

                    <div>
                      <dt className="text-stone-600">Tang chứng:</dt>
                      <dd>{suspect.evidence}</dd>
                    </div>
                  </dl>
                </div>
              </motion.article>
            ))}

            <motion.div
              className="evidence-card intro-evidence-card relative z-10 lg:col-start-2 lg:row-start-2 lg:self-start"
              initial={{ opacity: 0, y: 28, rotate: 1 }}
              animate={{ opacity: 1, y: 0, rotate: 1 }}
              transition={{ delay: 0.28, duration: 0.5 }}
            >
              <span className="pin pin-left" />
              <span className="pin pin-right" />

              <div className="intro-photo-frame intro-evidence-photo relative overflow-hidden border border-stone-900/30 bg-stone-900">
                <img
                  src="/assets/case-evidence-couple.jpeg"
                  alt="Bằng chứng quan trọng: hai đối tượng tạo hình trái tim"
                  className="h-full w-full object-cover sepia-[0.12]"
                  style={{ objectPosition: "center 38%" }}
                  draggable={false}
                />

                <div className="absolute right-3 top-3 rotate-[8deg] border-2 border-red-800/75 px-2.5 py-1 font-mono text-xs font-black uppercase tracking-[0.14em] text-red-900 sm:right-4 sm:top-4 sm:px-3 sm:text-sm">
                  Evidence
                </div>
              </div>

              <div className="-mt-2 mx-3 border border-stone-900/25 bg-[#d6c19b] px-3 py-2 shadow-md sm:mx-4">
                <p className="mb-1 flex items-center gap-2 font-display text-base font-black uppercase text-stone-950 sm:text-lg">
                  <Camera size={20} />
                  Bằng chứng quan trọng
                </p>

                <p className="font-mono text-[10px] font-black uppercase leading-4">
                  Hai đối tượng bị bắt gặp đang tạo hình trái tim tại hiện trường. Hành vi cực kỳ đáng ngờ.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="torn-note relative hidden p-3 lg:col-start-1 lg:row-start-3 lg:self-start xl:block"
              initial={{ opacity: 0, y: 18, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: -2 }}
              transition={{ delay: 0.38, duration: 0.42 }}
            >
              <p className="mb-1 font-display text-base font-black uppercase tracking-[0.08em]">
                Kết luận tạm thời
              </p>

              <p className="font-mono text-[10px] font-bold leading-4">
                ☑ Không thể bắt giữ vì quá đáng yêu.
                <br />
                ☑ Chuyển hồ sơ sang đội Chúc Mừng Sinh Nhật.
              </p>

              <div className="mt-3 w-fit rotate-[-4deg] border-2 border-red-800/70 px-3 py-1 font-display text-xl font-black uppercase text-red-900">
                Too cute
              </div>
            </motion.div>

            <motion.div
              className="mission-file relative p-3 lg:col-start-2 lg:row-start-3 lg:self-start lg:-translate-y-2 xl:-translate-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.42 }}
            >
              <p className="mb-1 inline-flex items-center gap-2 border border-stone-900/50 px-3 py-1 font-mono text-xs font-black uppercase">
                <Fingerprint size={16} />
                Mission
              </p>

              <h2 className="font-display text-lg font-black uppercase tracking-[0.06em] sm:text-2xl">
                Mở hồ sơ để điều tra
              </h2>

              <p className="mt-1 font-mono text-[10px] font-black uppercase leading-4">
                Cảnh báo: hồ sơ này có thể khiến bạn cười và mỉm cười liên tục.
              </p>

              <button
                type="button"
                className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 bg-stone-950 px-4 py-2 font-display text-xs font-black uppercase tracking-[0.08em] text-amber-100 shadow-xl transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-red-900/30 sm:w-auto"
                onClick={onContinue}
              >
                Tiếp tục điều tra <ArrowRight size={18} />
              </button>
            </motion.div>

            <motion.div
              className="sticky-note hidden p-3 font-mono text-xs font-black uppercase leading-5 lg:col-start-3 lg:row-start-3 lg:self-start xl:block"
              initial={{ opacity: 0, y: 18, rotate: 3 }}
              animate={{ opacity: 1, y: 0, rotate: 3 }}
              transition={{ delay: 0.46, duration: 0.42 }}
            >
              <p className="mb-2 flex items-center gap-2">
                <AlertTriangle size={16} />
                Ghi chú:
              </p>
              Sinh nhật sắp tới
              <br />
              Chuẩn bị bất ngờ
              <br />
              Yêu thương max level
            </motion.div>
          </div>

          <div className="absolute left-6 top-5 hidden rotate-[-12deg] border-2 border-red-900/55 px-4 py-2 font-display text-xl font-black uppercase tracking-[0.08em] text-red-900/80 md:block xl:text-2xl">
            Top Secret
          </div>

          <div className="absolute right-6 top-6 hidden rotate-[7deg] border-2 border-red-900/45 px-4 py-2 font-display text-lg font-black uppercase tracking-[0.08em] text-red-900/70 md:block xl:text-xl">
            Confidential
          </div>

          <div className="absolute bottom-5 right-5 hidden items-center gap-2 rounded-sm border border-amber-200/20 bg-stone-950/70 px-3 py-2 font-mono text-xs font-black uppercase tracking-[0.18em] text-amber-100 lg:flex">
            <Siren size={15} />
            Bước 01 / Cảnh báo truy cập
          </div>

          <div className="absolute bottom-6 left-6 hidden rotate-[4deg] items-center gap-2 border border-stone-900/40 bg-[#c9b181] px-3 py-2 font-mono text-xs font-black uppercase md:flex">
            <FileWarning size={15} />
            Hồ sơ tuyệt mật
          </div>
        </motion.div>
      </div>
    </section>
  );
}