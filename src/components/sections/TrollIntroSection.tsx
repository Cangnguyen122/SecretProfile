import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  HeartHandshake,
  ShieldAlert,
  Siren,
  Volume2,
  VolumeX,
} from "lucide-react";
import { birthdayConfig } from "../../data/birthdayConfig";
import { GlitchText } from "../ui/GlitchText";

type TrollIntroSectionProps = {
  isMusicOn: boolean;
  onContinue: () => void;
  onToggleMusic: () => void;
};

export function TrollIntroSection({
  isMusicOn,
  onContinue,
  onToggleMusic,
}: TrollIntroSectionProps) {
  return (
    <section className="terminal-grid relative flex min-h-screen items-center overflow-hidden bg-slate-950 px-4 py-10 text-emerald-100 sm:py-14">
      <div className="scanlines absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(244,63,94,0.24),transparent_32%),radial-gradient(circle_at_82%_5%,rgba(168,85,247,0.22),transparent_30%),radial-gradient(circle_at_50%_88%,rgba(34,197,94,0.18),transparent_34%)]" />

      <div className="relative mx-auto w-full max-w-6xl">
        <button
          type="button"
          className="absolute right-0 top-0 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white shadow-lg backdrop-blur transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-emerald-200/40"
          aria-label={isMusicOn ? "Tắt âm thanh phóng sự" : "Bật âm thanh phóng sự"}
          aria-pressed={isMusicOn}
          title={isMusicOn ? "Tắt âm thanh phóng sự" : "Bật âm thanh phóng sự"}
          onClick={onToggleMusic}
        >
          {isMusicOn ? <Volume2 size={19} /> : <VolumeX size={19} />}
        </button>

        <motion.div
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/12 px-4 py-2 text-sm font-black uppercase tracking-[0.24em] text-red-100 shadow-lg shadow-red-950/40"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ShieldAlert size={17} />
          Bước 01 / Cảnh báo truy cập
        </motion.div>

        <div className="grid gap-5 rounded-[30px] border border-emerald-300/20 bg-slate-950/78 p-5 shadow-neon backdrop-blur-xl sm:p-7 lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
          <div className="flex min-h-[500px] flex-col justify-between rounded-[24px] border border-white/10 bg-white/[0.035] p-5 sm:p-7">
            <div>
              <p className="mb-4 font-mono text-xs text-emerald-300/80 sm:text-sm">
                phong-su-dieu-tra@ho-so-mat:~$ mo_ho_so_thang_6.exe
              </p>
              <h1 className="font-display text-4xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
                <GlitchText>{birthdayConfig.conceptName}</GlitchText>
              </h1>
              <p className="mt-5 max-w-xl text-base font-semibold leading-7 text-slate-300 sm:text-lg">
                Một hồ sơ bị niêm phong vì chứa quá nhiều bằng chứng sinh nhật, ảnh đáng nghi và dấu hiệu được yêu thương quá mức.
              </p>
            </div>

            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-emerald-300/85">
                <span>Đang xác minh hồ sơ</span>
                <span>01/03</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-fuchsia-400 to-red-400"
                  initial={{ width: "8%" }}
                  animate={{ width: "28%" }}
                  transition={{ duration: 1.6, ease: "easeInOut" }}
                />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm font-bold">
                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                  <CalendarDays className="mb-2 text-emerald-200" size={20} />
                  17/06 + 19/06
                </div>
                <div className="rounded-2xl border border-fuchsia-300/20 bg-fuchsia-300/10 p-4">
                  <HeartHandshake className="mb-2 text-fuchsia-200" size={20} />
                  Tín hiệu đáng nghi
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[24px] border border-white/10 bg-slate-900/70 p-4 sm:p-5">
            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200">
                    Phòng phóng sự điều tra
                  </p>
                  <h2 className="mt-1 text-2xl font-black text-white">Mở đầu điều tra</h2>
                </div>
                <Siren className="text-red-300" />
              </div>

              <div className="grid gap-3 font-mono text-sm sm:text-[15px]">
                {birthdayConfig.introMessages.slice(0, 3).map((message, index) => (
                  <motion.p
                    key={message}
                    className="flex gap-3 rounded-2xl border border-emerald-200/30 bg-emerald-300/12 px-4 py-3 text-white shadow-sm shadow-emerald-950/40 ring-1 ring-white/8"
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.18 + index * 0.11, duration: 0.38 }}
                  >
                    <span className="shrink-0 text-fuchsia-300">
                      [{String(index + 1).padStart(2, "0")}]
                    </span>
                    <span>{message}</span>
                  </motion.p>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-red-300/25 bg-red-500/12 p-4 text-sm font-bold leading-7 text-red-100">
              Chưa được xem hồ sơ chính. Cần đi qua từng bước xác minh trước.
            </div>

            <button
              type="button"
              className="mt-5 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-white px-5 py-4 font-black text-slate-950 shadow-xl transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-emerald-200"
              onClick={onContinue}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onContinue();
                }
              }}
            >
              Tiếp tục điều tra <ArrowRight size={19} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
