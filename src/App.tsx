import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CoupleTimelineSection } from "./components/sections/CoupleTimelineSection";
import { EmotionalRevealSection } from "./components/sections/EmotionalRevealSection";
import { FinalCelebrationSection } from "./components/sections/FinalCelebrationSection";
import { MemoryGallerySection } from "./components/sections/MemoryGallerySection";
import { RunawayButtonRevealSection } from "./components/sections/RunawayButtonRevealSection";
import { SecretScanSection } from "./components/sections/SecretScanSection";
import { TrollIntroSection } from "./components/sections/TrollIntroSection";
import { VideoWishesSection } from "./components/sections/VideoWishesSection";
import { ScrollProgress } from "./components/ui/ScrollProgress";
import { birthdayConfig } from "./data/birthdayConfig";

type ExperienceStage = "intro" | "scan" | "challenge" | "story";

export default function App() {
  const [stage, setStage] = useState<ExperienceStage>("intro");

  const introAudioRef = useRef<HTMLAudioElement | null>(null);
  const mainAudioRef = useRef<HTMLAudioElement | null>(null);

  const [introMusicOn, setIntroMusicOn] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [stage]);

  useEffect(() => {
    if (stage !== "intro") return;

    startIntroMusic();
  }, [stage]);

  useEffect(() => {
    if (stage !== "story") {
      stopMainMusic();
      return;
    }

    stopIntroMusic();
    startMainMusic();
  }, [stage]);

  function startIntroMusic() {
    const audio = introAudioRef.current;
    if (!audio) return;

    audio.volume = 0.42;
    audio.loop = true;
    audio.muted = false;

    void audio
      .play()
      .then(() => setIntroMusicOn(true))
      .catch(() => setIntroMusicOn(false));
  }

  function stopIntroMusic() {
    const audio = introAudioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;
    setIntroMusicOn(false);
  }

  function startMainMusic() {
    const audio = mainAudioRef.current;
    if (!audio) return;

    audio.volume = 0.5;
    audio.loop = true;
    audio.muted = false;

    void audio.play().catch(() => {
      // Một số trình duyệt có thể chặn autoplay nếu chưa có tương tác.
    });
  }

  function stopMainMusic() {
    const audio = mainAudioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;
  }

  useEffect(() => {
    if (stage === "challenge" || stage === "story" || introMusicOn) return;

    const startOnFirstInteraction = () => startIntroMusic();

    window.addEventListener("pointerdown", startOnFirstInteraction, { once: true, capture: true });
    window.addEventListener("mousedown", startOnFirstInteraction, { once: true, capture: true });
    window.addEventListener("click", startOnFirstInteraction, { once: true, capture: true });
    window.addEventListener("keydown", startOnFirstInteraction, { once: true, capture: true });
    window.addEventListener("touchstart", startOnFirstInteraction, { once: true, capture: true });

    return () => {
      window.removeEventListener("pointerdown", startOnFirstInteraction, { capture: true });
      window.removeEventListener("mousedown", startOnFirstInteraction, { capture: true });
      window.removeEventListener("click", startOnFirstInteraction, { capture: true });
      window.removeEventListener("keydown", startOnFirstInteraction, { capture: true });
      window.removeEventListener("touchstart", startOnFirstInteraction, { capture: true });
    };
  }, [stage, introMusicOn]);

  function toggleIntroMusic() {
    const audio = introAudioRef.current;
    if (!audio) return;

    if (introMusicOn) {
      stopIntroMusic();
      return;
    }

    startIntroMusic();
  }

  function goToChallenge() {
    stopIntroMusic();
    stopMainMusic();
    setStage("challenge");
  }

  function goToStory() {
    stopIntroMusic();
    setStage("story");

    window.setTimeout(() => {
      startMainMusic();
    }, 80);
  }

  useEffect(() => {
    return () => {
      stopIntroMusic();
      stopMainMusic();
    };
  }, []);

  return (
    <main>
      <audio
        ref={introAudioRef}
        src={birthdayConfig.introMusicSrc}
        preload="auto"
        autoPlay
        loop
        playsInline
      />

      <audio
        ref={mainAudioRef}
        src="/assets/HPBD.mp3"
        preload="auto"
        loop
        playsInline
      />

      <ScrollProgress />

      <AnimatePresence mode="wait">
        {stage === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <TrollIntroSection
              isMusicOn={introMusicOn}
              onContinue={() => setStage("scan")}
              onToggleMusic={toggleIntroMusic}
            />
          </motion.div>
        )}

        {stage === "scan" && (
          <motion.div
            key="scan"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <SecretScanSection onContinue={goToChallenge} />
          </motion.div>
        )}

        {stage === "challenge" && (
          <motion.div
            key="challenge"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <RunawayButtonRevealSection onUnlocked={goToStory} />
          </motion.div>
        )}

        {stage === "story" && (
          <motion.div
            key="story"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <EmotionalRevealSection />
            <VideoWishesSection />
            <MemoryGallerySection />
            <FinalCelebrationSection />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}