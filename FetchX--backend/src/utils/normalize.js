export function normalizePexels(data) {
  if (!Array.isArray(data?.items)) return [];

  return data.items.map(item => ({
    id: item.id,
    type: "image",
    source: "pexels",

    width: item.width,
    height: item.height,

    url: item.src?.original,
    preview: item.src?.medium,

    alt: item.alt,
    author: item.photographer,
  }));
}


export function normalizePexelsVideos(data) {
  if (!Array.isArray(data?.items)) return [];

  return data.items.map(item => {
    // prefer highest quality mp4
    const bestFile =
      item.video_files?.find(v => v.quality === "hd") ||
      item.video_files?.[0];

    return {
      id: item.id,
      type: "video",
      source: "pexels",

      width: bestFile?.width || item.width,
      height: bestFile?.height || item.height,

      url: bestFile?.link,
      preview: item.image,

      duration: item.duration,
      author: item.user?.name,
    };
  });
}


export function normalizeUnsplash(data) {
  if (!Array.isArray(data?.items)) return [];

  return data.items.map(item => ({
    id: item.id,
    type: "image",
    source: "unsplash",

    width: item.width,
    height: item.height,

    url: item.urls?.full,
    preview: item.urls?.regular,

    alt: item.alt_description,
    author: item.user?.name,
  }));
}


export function normalizePixabayImages(data) {
  if (!Array.isArray(data?.items)) return [];

  return data.items.map(item => ({
    id: item.id,
    type: "image",
    source: "pixabay",

    width: item.imageWidth,
    height: item.imageHeight,

    url: item.largeImageURL,
    preview: item.webformatURL,

    alt: item.tags,
    author: item.user,
  }));
}


export function normalizePixabayVideos(data) {
  if (!Array.isArray(data?.items)) return [];

  return data.items.map(item => {
    // prefer largest available video
    const video =
      item.videos?.large ||
      item.videos?.medium ||
      item.videos?.small ||
      item.videos?.tiny;

    return {
      id: item.id,
      type: "video",
      source: "pixabay",

      width: video?.width,
      height: video?.height,

      url: video?.url,
      preview: video?.thumbnail,

      duration: item.duration,
      author: item.user,
    };
  });
}
