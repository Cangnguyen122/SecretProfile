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

type VideoWishesSectionProps = {
  onVideoPlay?: () => void;
  onVideoPause?: () => void;
  onVideoEnded?: () => void;
};

export function VideoWishesSection({
  onVideoPlay,
  onVideoPause,
  onVideoEnded,
}: VideoWishesSectionProps){
  const embedUrl = getEmbedUrl(birthdayConfig.videoWishesUrl);
  const isDirectVideo = /\.(mp4|webm|ogg)(\?.*)?$/i.test(embedUrl);

  return (
    <SectionWrapper id="video-wishes" className="bg-[#151329] text-white">
      <FloatingParticles tone="cool" />
      <div className="relative mx-auto max-w-5xl">
        {/* phần text giữ nguyên */}

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
                  onPlay={onVideoPlay}
                  onPause={(event) => {
                    if (event.currentTarget.ended) return;
                    onVideoPause?.();
                  }}
                  onEnded={onVideoEnded}
                  onError={onVideoEnded}
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
              // phần fallback giữ nguyên
              <div className="relative h-full">
                {/* giữ nguyên code cũ */}
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
