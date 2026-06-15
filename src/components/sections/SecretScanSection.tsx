import { motion } from "framer-motion";
import { Activity, AlertTriangle, ArrowRight, Fingerprint, ScanLine } from "lucide-react";
import { birthdayConfig } from "../../data/birthdayConfig";
import { SectionWrapper } from "../ui/SectionWrapper";

type SecretScanSectionProps = {
  onContinue: () => void;
};

export function SecretScanSection({ onContinue }: SecretScanSectionProps) {
  return (
    <SectionWrapper
      id="secret-scan"
      className="terminal-grid min-h-screen bg-slate-950 text-white"
      contentClassName="relative min-h-screen flex items-center"
    >
      <div className="scanlines absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(244,63,94,0.2),transparent_32%),radial-gradient(circle_at_82%_5%,rgba(168,85,247,0.18),transparent_30%),radial-gradient(circle_at_50%_88%,rgba(34,197,94,0.14),transparent_34%)]" />

      <div className="relative mx-auto w-full max-w-6xl">
        <motion.div
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-2 text-sm font-black uppercase tracking-[0.24em] text-cyan-100 shadow-lg shadow-cyan-950/40"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42 }}
        >
          <Activity size={17} />
          Bước 02 / Đang quét hồ sơ
        </motion.div>

        <div className="grid gap-5 rounded-[30px] border border-emerald-300/20 bg-slate-950/78 p-5 shadow-neon backdrop-blur-xl sm:p-7 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
          <div className="flex min-h-[500px] flex-col justify-between rounded-[24px] border border-white/10 bg-white/[0.035] p-5 sm:p-7">
            <div>
              <p className="mb-4 font-mono text-xs text-emerald-300/80 sm:text-sm">
                phong-su-dieu-tra@ho-so-mat:~$ scan_bang_chung.exe
              </p>
              <h2 className="font-display text-3xl font-black leading-tight text-white sm:text-5xl">
                Hệ thống đang đối chiếu các dấu hiệu đáng nghi.
              </h2>
              <p className="mt-5 max-w-xl text-base font-semibold leading-7 text-slate-300 sm:text-lg">
                Dữ liệu sinh nhật, mức độ thân thiết và lượng bằng chứng phát cơm chó đang được gom vào cùng một hồ sơ.
              </p>
            </div>

            <div className="mt-8 rounded-[24px] border border-cyan-200/20 bg-cyan-200/10 p-5">
              <div className="mb-4 flex items-center gap-3 text-cyan-100">
                <Fingerprint size={22} />
                <span className="text-sm font-black uppercase tracking-[0.24em]">Biên bản xác minh</span>
              </div>
              <p className="text-base font-semibold leading-7 text-slate-200">
                Đã xác nhận ngày sinh 17/06 và 19/06. Đã phát hiện nhiều dấu hiệu thân thiết vượt ngưỡng. Cần thêm một bài kiểm tra cuối trước khi mở hồ sơ chính.
              </p>
            </div>
          </div>

          <div className="flex flex-col rounded-[24px] border border-white/10 bg-slate-900/70 p-4 sm:p-5">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-fuchsia-200">
                  Phòng phân tích bằng chứng
                </p>
                <h3 className="mt-1 text-2xl font-black">Kết quả quét sơ bộ</h3>
              </div>
              <ScanLine className="text-emerald-200" />
            </div>

            <div className="space-y-5">
              {birthdayConfig.scanStats.map((stat, index) => (
                <div key={stat.label}>
                  <div className="mb-2 flex items-end justify-between gap-4">
                    <span className="font-semibold text-slate-100">{stat.label}</span>
                    <span className="text-right text-sm font-black text-emerald-200">{stat.value}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-950/80">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-fuchsia-300 to-rose-300"
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.percent}%` }}
                      transition={{ delay: index * 0.08, duration: 0.85, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-2xl border border-red-300/25 bg-red-500/12 p-4 text-sm font-bold leading-7 text-red-100">
              <div className="mb-2 flex items-center gap-2 uppercase tracking-[0.16em]">
                <AlertTriangle size={16} />
                Cảnh báo hệ thống
              </div>
              Hai đối tượng quá hợp, không thể xử lý bằng thuật toán bình thường.
            </div>

            <button
              type="button"
              className="mt-auto inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-4 font-black text-slate-950 shadow-xl transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-emerald-200"
              onClick={onContinue}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onContinue();
                }
              }}
            >
              Chuyển sang bài kiểm tra cuối <ArrowRight size={19} />
            </button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
