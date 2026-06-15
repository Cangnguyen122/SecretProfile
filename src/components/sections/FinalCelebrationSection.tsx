import { Gift, RotateCcw, Video } from "lucide-react";
import { useEffect } from "react";
import { birthdayConfig } from "../../data/birthdayConfig";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { CelebrationCanvas } from "../ui/CelebrationCanvas";
import { fireConfettiBurst } from "../ui/ConfettiBurst";
import { SectionWrapper } from "../ui/SectionWrapper";

export function FinalCelebrationSection() {
  const { personA, personB } = birthdayConfig;
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const section = document.getElementById("final-celebration");
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fireConfettiBurst();
        }
      },
      { threshold: 0.45 },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [prefersReducedMotion]);

  const petals = Array.from({ length: 18 }, (_, index) => index + 1);
  const fireworks = Array.from({ length: 7 }, (_, index) => index + 1);

  return (
    <SectionWrapper
      id="final-celebration"
      className="romantic-celebration-bg text-slate-950"
      contentClassName="min-h-screen flex items-center"
    >
      <CelebrationCanvas />
      {!prefersReducedMotion && (
        <div className="celebration-sky" aria-hidden="true">
          {fireworks.map((firework) => (
            <span key={`firework-${firework}`} className={`firework firework-${firework}`} />
          ))}
          {petals.map((petal) => (
            <span key={`petal-${petal}`} className={`petal petal-${petal}`} />
          ))}
        </div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
        <div className="mx-auto mb-7 grid h-20 w-20 place-items-center rounded-full bg-white/85 shadow-2xl shadow-rose-300/40">
          <Gift size={38} />
        </div>
        <p className="bg-gradient-to-r from-rose-700 via-fuchsia-700 to-indigo-700 bg-clip-text font-display text-5xl font-black leading-none text-transparent sm:text-7xl lg:text-8xl">
          HAPPY BIRTHDAY
        </p>
        <p className="mt-4 font-display text-3xl font-black text-rose-950 sm:text-5xl">
          {personA.birthday} & {personB.birthday}
        </p>
        <h2 className="mt-3 font-display text-3xl font-black text-slate-950 sm:text-5xl">
          {personA.name} & {personB.name}
        </h2>

        <div className="mx-auto mt-8 max-w-4xl rounded-[30px] border border-white/70 bg-white/72 p-5 shadow-2xl shadow-rose-400/20 backdrop-blur sm:p-8">
          <p className="text-xl font-bold leading-9">{birthdayConfig.finalMessage}</p>
          <p className="mt-5 text-lg font-semibold leading-8 text-slate-700">
            {birthdayConfig.finalLine}
          </p>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-4 font-black text-rose-950 shadow-xl shadow-rose-600/10 transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-white"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <RotateCcw size={19} /> Xem lại từ đầu
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white/72 px-5 py-4 font-black text-rose-950 shadow-xl shadow-rose-600/10 transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-white"
            onClick={() =>
              document.getElementById("video-wishes")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <Video size={19} /> Xem lại lời chúc
          </button>
        </div>
      </div>
    </SectionWrapper>
  );
}
