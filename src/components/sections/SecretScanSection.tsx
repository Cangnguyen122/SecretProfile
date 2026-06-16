import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Fingerprint, ScanLine } from "lucide-react";
import { birthdayConfig } from "../../data/birthdayConfig";
import { SectionWrapper } from "../ui/SectionWrapper";

type SecretScanSectionProps = {
  onContinue: () => void;
};

export function SecretScanSection({ onContinue }: SecretScanSectionProps) {
  return (
    <SectionWrapper
      id="secret-scan"
      className="case-board relative min-h-screen text-stone-950 lg:h-screen"
      contentClassName="relative flex min-h-screen items-center !max-w-none !px-3 !py-3 sm:!px-4 sm:!py-4 lg:!h-screen"
    >
      <motion.div
        className="investigation-board intro-board relative z-10 min-h-[calc(100vh-1.5rem)] w-full overflow-visible rounded-[8px] border border-amber-950/50 p-4 sm:p-5 lg:h-full lg:min-h-0 lg:overflow-hidden lg:p-6"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="absolute left-[12%] top-[21%] h-[2px] w-[33%] rotate-[8deg] bg-red-800/65" />
        <div className="absolute right-[12%] top-[28%] h-[2px] w-[36%] -rotate-[7deg] bg-red-800/65" />

        <div className="grid gap-4 lg:h-full lg:grid-cols-[0.82fr_1.18fr]">
          <div className="paper-slip relative flex min-h-[620px] flex-col justify-between overflow-hidden p-4 sm:min-h-[680px] sm:p-5 lg:min-h-0">
            <span className="pin pin-left" />
            <span className="pin pin-right" />

            <div>
              <p className="mb-3 inline-flex items-center gap-2 bg-red-800 px-3 py-1 font-mono text-xs font-black uppercase tracking-[0.18em] text-amber-50">
                <ScanLine size={14} />
                Bước 02 / Đang quét hồ sơ
              </p>

              {/* <p className="mb-3 font-mono text-[11px] font-black uppercase tracking-[0.14em] text-stone-700 sm:text-xs">
                phong-su-dieu-tra@ho-so-mat:~$ scan_bang_chung.exe
              </p> */}

              <h2 className="font-display text-3xl font-black uppercase leading-tight tracking-[0.06em] text-stone-950 sm:text-4xl xl:text-5xl">
                Đối chiếu dấu hiệu đáng nghi
              </h2>

              <p className="mt-3 max-w-xl font-mono text-xs font-bold uppercase leading-6 text-stone-800 sm:text-sm">
                Dữ liệu sinh nhật, mức độ thân thiết và lượng bằng chứng phát cơm chó
                đang được gom vào cùng một hồ sơ.
              </p>

              <div className="mt-5 border border-stone-900/35 bg-[#cbb58d] p-2 shadow-inner">
                <div className="relative overflow-hidden border border-stone-900/35 bg-stone-950/10">
                  <img
                    src={birthdayConfig.caseEvidencePhotoSrc}
                    alt="Ảnh bằng chứng của cặp đôi"
                    className="aspect-[4/3] w-full object-cover sm:aspect-[10/7]"
                    style={{
                      objectPosition: "center 100%",
                    }}
                    loading="eager"
                    draggable={false}
                  />

                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(120,53,15,0.18),rgba(245,158,11,0.08)_45%,rgba(28,25,23,0.2))] mix-blend-multiply" />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/20" />

                  {/* <div className="absolute left-3 top-3 bg-red-900 px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-amber-50 shadow-lg sm:text-xs">
                    Bằng chứng A-17/19
                  </div> */}

                  <div className="absolute bottom-3 right-3 bg-stone-950/82 px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-amber-100 shadow-lg backdrop-blur-sm sm:text-xs">
                    Đã xác minh
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between gap-3 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-stone-800 sm:text-xs">
                  <span>Ảnh đối chiếu</span>
                  <span>17/06 × 19/06</span>
                </div>
              </div>
            </div>

            <div className="mt-5 border border-stone-900/35 bg-[#d6c19b] p-3 sm:p-4">
              <div className="mb-2 flex items-center gap-2 font-display text-base font-black uppercase tracking-[0.06em] sm:text-lg">
                <Fingerprint size={20} />
                Biên bản xác minh
              </div>

              <p className="font-mono text-[11px] font-black uppercase leading-6 sm:text-xs">
                Đã xác nhận ngày sinh 17/06 và 19/06. Đã phát hiện nhiều dấu hiệu
                thân thiết vượt ngưỡng. Cần thêm một bài kiểm tra cuối trước khi mở
                hồ sơ chính.
              </p>
            </div>
          </div>

          <div className="case-file-card relative p-4 lg:overflow-auto lg:p-5">
            <span className="pin pin-top" />

            <div className="mb-4 flex items-center justify-between gap-4 border-b border-stone-900/35 pb-3">
              <div>
                <p className="font-mono text-xs font-black uppercase tracking-[0.18em] text-red-900">
                  Phòng phân tích bằng chứng
                </p>
                <h3 className="mt-1 font-display text-2xl font-black uppercase tracking-[0.06em]">
                  Kết quả quét sơ bộ
                </h3>
              </div>

              <div className="grid h-12 w-12 place-items-center rounded-full bg-stone-950 text-amber-100">
                <ScanLine size={22} />
              </div>
            </div>

            <div className="grid gap-3">
              {birthdayConfig.scanStats.map((stat, index) => (
                <div key={stat.label} className="border border-stone-900/25 bg-[#d6c19b]/75 p-3">
                  <div className="mb-2 flex items-end justify-between gap-4 font-mono text-xs font-black uppercase">
                    <span>{stat.label}</span>
                    <span className="text-right text-red-900">{stat.value}</span>
                  </div>

                  <div className="h-2.5 overflow-hidden bg-stone-950/25">
                    <motion.div
                      className="h-full bg-gradient-to-r from-red-900 via-amber-700 to-stone-950"
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.percent}%` }}
                      transition={{ delay: index * 0.08, duration: 0.85, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-2 border-red-900/65 bg-red-900/10 p-3 font-mono text-xs font-black uppercase leading-6 text-red-950">
              <div className="mb-1 flex items-center gap-2 tracking-[0.14em]">
                <AlertTriangle size={15} />
                Cảnh báo hệ thống
              </div>
              Hai đối tượng quá hợp, không thể xử lý bằng thuật toán bình thường.
            </div>

            <button
              type="button"
              className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-stone-950 px-5 py-3 font-display text-sm font-black uppercase tracking-[0.08em] text-amber-100 shadow-xl transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-red-900/30"
              onClick={onContinue}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onContinue();
                }
              }}
            >
              Chuyển sang bài kiểm tra cuối <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}