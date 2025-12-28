export function normalizePexels(data) {
  return data.photos.map(item => ({
    id: item.id,
    type: 'image',
    source: 'pexels',
    url: item.src.original,
    width: item.width,
    height: item.height
  }));
}

export function normalizePexelsVideos(data) {
  return data.videos.map(item => ({
    id: item.id,
    type: 'video',
    source: 'pexels',
    url: item.video_files[0].link,
    width: item.width,
    height: item.height
  }));
}

export function normalizeUnsplash(data) {
  return data.results.map(item => ({
    id: item.id,
    type: 'image',
    source: 'unsplash',
    url: item.urls.regular,
    width: item.width,
    height: item.height
  }));
}

export function normalizePixabayImages(data) {
  return data.hits.map(item => ({
    id: item.id,
    type: 'image',
    source: 'pixabay',
    url: item.largeImageURL,
    width: item.imageWidth,
    height: item.imageHeight
  }));
}

export function normalizePixabayVideos(data) {
  return data.hits.map(item => ({
    id: item.id,
    type: 'video',
    source: 'pixabay',
    url: item.videos.large.url,
    width: item.videos.large.width,
    height: item.videos.large.height
  }));
}
