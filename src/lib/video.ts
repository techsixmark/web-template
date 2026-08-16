/**
 * Chuyển link video công khai (YouTube/Vimeo) sang URL nhúng iframe.
 * Trả về null nếu không nhận diện được (khi đó nên hiển thị link ra ngoài
 * thay vì nhúng).
 */
export function getEmbedUrl(videoUrl: string): string | null {
  try {
    const url = new URL(videoUrl);

    // youtu.be/<id>
    if (url.hostname === "youtu.be") {
      const id = url.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    // youtube.com/watch?v=<id>  |  youtube.com/embed/<id>  |  youtube.com/shorts/<id>
    if (url.hostname.includes("youtube.com")) {
      if (url.pathname.startsWith("/embed/")) return videoUrl;
      const id =
        url.searchParams.get("v") ??
        (url.pathname.startsWith("/shorts/") ? url.pathname.split("/")[2] : null);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    // vimeo.com/<id>
    if (url.hostname.includes("vimeo.com")) {
      const id = url.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }

    return null;
  } catch {
    return null;
  }
}

/** File video trực tiếp (mp4/webm) dùng thẻ <video> thay vì iframe. */
export function isDirectVideoFile(videoUrl: string): boolean {
  return /\.(mp4|webm|ogg)$/i.test(new URL(videoUrl).pathname);
}
