import { youtubeLinkParser } from '../../../../../shared/components/Editor/helpers/linkParsers';

export const imageParser = (content: string): string[] => {
  const linkSet = new Set([]);
  const contentElement = document.createElement('div');
  contentElement.innerHTML = content;

  const allImages = contentElement.querySelectorAll('img');
  allImages.forEach((image) => {
    linkSet.add(image.getAttribute('src'));
  });

  const allYoutubeVideos = contentElement.querySelectorAll('iframe.youtube');
  allYoutubeVideos.forEach((video) => {
    const id = youtubeLinkParser(video.getAttribute('src'));
    linkSet.add(`https://img.youtube.com/vi/${id}/0.jpg`);
  });

  return Array.from(linkSet);
};
