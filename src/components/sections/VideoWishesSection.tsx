import { Film, PlayCircle } from "lucide-react";
import { birthdayConfig } from "../../data/birthdayConfig";
import { FloatingParticles } from "../ui/FloatingParticles";
import { SectionWrapper } from "../ui/SectionWrapper";

function getEmbedUrl(url: string) {
  if (!url || url === "VIDEO_WISHES_URL") return "";
  if (url.startsWith("/")) return url;

  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    }
    if (parsed.hostname.includes("drive.google.com")) {
      const match = parsed.pathname.match(/\/file\/d\/([^/]+)/);
      return match ? `https://drive.google.com/file/d/${match[1]}/preview` : url;
    }
    return url;
  } catch {
    return "";
  }
}

export function VideoWishesSection() {
  const embedUrl = getEmbedUrl(birthdayConfig.videoWishesUrl);
  const isDirectVideo = /\.(mp4|webm|ogg)(\?.*)?$/i.test(embedUrl);

  return (
    <SectionWrapper id="video-wishes" className="bg-[#151329] text-white">
      <FloatingParticles tone="cool" />
      <div className="relative mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-violet-200/20 bg-violet-200/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.24em] text-violet-100">
            <Film size={16} /> Mini cinema
          </p>
          <h2 className="mx-auto mt-5 max-w-3xl font-display text-3xl font-black leading-tight sm:text-5xl">
            Những lời chúc được gửi riêng cho hai bạn
          </h2>
          <p className="mt-4 text-lg text-violet-100/78">
            Cười cũng được, khóc cũng được, nhưng coi hết nha.
          </p>
        </div>

        <p className="mx-auto mb-7 max-w-3xl text-center text-lg leading-8 text-slate-300">
          Tụi mình không giỏi nói mấy lời sến súa trực tiếp. Nên tụi mình để mọi
          người nói thay ở đây.
        </p>

        <div className="overflow-hidden rounded-[30px] border border-white/12 bg-black shadow-[0_0_80px_rgba(168,85,247,0.28)]">
          <div className="aspect-video">
            {embedUrl ? (
              isDirectVideo ? (
                <video
                  className="h-full w-full bg-black object-contain"
                  controls
                  playsInline
                  preload="metadata"
                  poster={birthdayConfig.videoPosterSrc}
                >
                  <source src={embedUrl} />
                </video>
              ) : (
                <iframe
                  className="h-full w-full"
                  src={embedUrl}
                  title="Video lời chúc sinh nhật"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              )
            ) : (
              <div className="relative h-full">
                <img
                  src={birthdayConfig.videoPosterSrc}
                  alt="Poster tạm cho video lời chúc sinh nhật"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 grid place-items-center bg-slate-950/20 p-5 text-center">
                  <div className="max-w-md rounded-[28px] border border-white/18 bg-slate-950/60 p-5 shadow-2xl backdrop-blur-md">
                    <PlayCircle className="mx-auto mb-4 text-violet-100" size={58} />
                    <p className="text-2xl font-black">Video lời chúc sẽ được đặt ở đây.</p>
                    <p className="mt-3 text-sm leading-6 text-violet-100/82">
                      Tạm thời dùng poster này để giữ nhịp cảm xúc. Thay
                      VIDEO_WISHES_URL trong config bằng YouTube, Google Drive hoặc MP4.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="mt-7 text-center text-xl font-bold text-violet-100">
          Thấy chưa, hai bạn được thương nhiều hơn hai bạn tưởng đó.
        </p>
      </div>
    </SectionWrapper>
  );
}
