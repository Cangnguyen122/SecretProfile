import { birthdayConfig } from "../../data/birthdayConfig";
import { FloatingParticles } from "../ui/FloatingParticles";
import { SectionWrapper } from "../ui/SectionWrapper";

export function EmotionalRevealSection() {
  const { personA, personB } = birthdayConfig;

  return (
    <SectionWrapper
      id="emotional-reveal"
      className="bg-[linear-gradient(135deg,#fff7ed,#fce7f3_45%,#dbeafe)] text-slate-950"
      contentClassName="relative"
    >
      <FloatingParticles tone="warm" />
      <div className="relative grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="order-2 lg:order-1">
          <div className="overflow-hidden rounded-[30px] border border-white/70 bg-white/50 p-3 shadow-2xl backdrop-blur">
            <img
              src={birthdayConfig.emotionalCollageSrc}
              alt="Ảnh ghép tạm cho phần chuyển cảm xúc"
              className="aspect-[4/3] w-full rounded-[22px] object-cover"
              loading="lazy"
            />
          </div>
          <div className="mx-auto mt-4 grid max-w-sm grid-cols-3 gap-3 text-center text-sm font-black text-slate-700">
            <div className="rounded-2xl bg-white/70 px-3 py-3 shadow-sm">17/06</div>
            <div className="rounded-2xl bg-white/70 px-3 py-3 shadow-sm">&</div>
            <div className="rounded-2xl bg-white/70 px-3 py-3 shadow-sm">19/06</div>
          </div>
        </div>

        <div className="order-1 text-center lg:order-2 lg:text-left">
          <h2 className="mt-5 font-display text-4xl font-black leading-tight sm:text-6xl">
            Happy Birthday {personA.name} & {personB.name}
          </h2>
          <div className="mt-8 grid gap-4 text-lg font-medium leading-8 text-slate-700">
            {birthdayConfig.emotionalLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p className="mt-8 rounded-[28px] bg-white/70 p-5 text-xl font-bold leading-9 shadow-xl backdrop-blur">
            Một chiếc web được tạo ra để troll, chúc mừng, và yêu thương hai nhân
            vật chính của tháng 6.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
