import { ExternalLink, Lock, PlayCircle, ShieldCheck, XCircle } from "lucide-react";
import { FormEvent, useState } from "react";
import { SectionWrapper } from "../ui/SectionWrapper";

type SecretVideoResponse = {
  url?: string;
  error?: string;
};

export function SecretVideoSection() {
  const [code, setCode] = useState("");
  const [secretUrl, setSecretUrl] = useState("");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [openWasBlocked, setOpenWasBlocked] = useState(false);

  async function unlockSecretVideo(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const trimmedCode = code.trim();

    if (!trimmedCode) {
      setError("Nhập mật mã đã rồi mới mở hồ sơ nha.");
      return;
    }

    setIsChecking(true);
    setError("");
    setOpenWasBlocked(false);

    try {
      const response = await fetch("/api/secret-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: trimmedCode }),
      });

      const data = (await response.json()) as SecretVideoResponse;

      if (!response.ok || !data.url) {
        setSecretUrl("");
        setError(data.error || "Sai mật mã rồi, hồ sơ vẫn đang được niêm phong.");
        return;
      }

      setSecretUrl(data.url);
      setError("");

      const openedWindow = window.open(data.url, "_blank", "noopener,noreferrer");

      if (!openedWindow) {
        setOpenWasBlocked(true);
      }
    } catch {
      setSecretUrl("");
      setError("Không mở được hồ sơ bí mật. Thử lại một lần nữa nha.");
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <SectionWrapper id="secret-video" className="bg-[#100b1f] text-white">
      <div className="relative mx-auto max-w-5xl text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-rose-200/20 bg-rose-200/10 px-4 py-2 text-sm font-black uppercase tracking-[0.24em] text-rose-100">
          <Lock size={16} />
          Secret archive
        </p>

        <h2 className="mx-auto mt-5 max-w-3xl font-display text-3xl font-black leading-tight sm:text-5xl">
          Hồ sơ bí mật chỉ dành riêng cho hai bạn
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-rose-100/78">
          Nhập đúng mật mã thì video bí mật sẽ được mở ở một trang mới.
        </p>

        <form
          onSubmit={(event) => void unlockSecretVideo(event)}
          className="mx-auto mt-8 max-w-xl rounded-[30px] border border-white/12 bg-white/8 p-5 shadow-2xl shadow-rose-500/10 backdrop-blur sm:p-7"
        >
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-rose-500/20 text-rose-100">
            <ShieldCheck size={30} />
          </div>

          <label className="block text-left text-sm font-black uppercase tracking-[0.2em] text-rose-100/80">
            Nhập mật mã
          </label>

          <input
            type="password"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Nhập mật mã bí mật"
            autoComplete="off"
            inputMode="text"
            className="mt-3 w-full rounded-2xl border border-white/14 bg-white px-4 py-4 text-center text-xl font-black text-slate-950 outline-none transition focus:ring-4 focus:ring-rose-300/40"
          />

          {error && (
            <p className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-red-500/12 px-4 py-3 text-sm font-bold text-red-100">
              <XCircle size={18} />
              {error}
            </p>
          )}

          {secretUrl && !error && (
            <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4 text-emerald-100">
              <p className="inline-flex items-center justify-center gap-2 text-sm font-black uppercase tracking-[0.18em]">
                <ShieldCheck size={16} />
                Đã mở khóa
              </p>

              <p className="mt-2 text-sm font-semibold leading-6">
                Video bí mật đã được mở ở tab mới.
              </p>

              {openWasBlocked && (
                <p className="mt-2 text-sm font-semibold leading-6 text-amber-100">
                  Nếu trình duyệt chặn tab mới, bấm nút bên dưới để mở thủ công.
                </p>
              )}

              <a
                href={secretUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-emerald-400 px-5 font-black text-slate-950 shadow-xl transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-emerald-200"
              >
                Mở video bí mật <ExternalLink size={18} />
              </a>
            </div>
          )}

          <button
            type="submit"
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-rose-500 px-5 font-black text-white shadow-xl shadow-rose-500/20 transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-rose-200 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isChecking}
          >
            <PlayCircle size={20} />
            {isChecking ? "Đang kiểm tra..." : "Mở video bí mật"}
          </button>
        </form>
      </div>
    </SectionWrapper>
  );
}