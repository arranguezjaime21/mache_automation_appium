// Test media pushed to the device by pushMediaFixture() (src/helper/media.js).
// file: the fixture in this folder · remotePath: where it lands on the device · mediaUri: media store table to check it was indexed
//
// Fixture files carry no "date taken", so after a push the photo picker sorts them by push time,
// i.e. first in the grid. Accepted template videos are 3–15s and up to 50MB.
const IMAGES = 'content://media/external/images/media';
const VIDEOS = 'content://media/external/video/media';

export const MediaFixture = {
    // 600×600 generated PNG
    image: {
        file: new URL('./template-image.png', import.meta.url),
        remotePath: '/sdcard/Pictures/auto-template-image.png',
        mediaUri: IMAGES
    },
    // 8.1s / 1.6MB, copy of the QA video mt-normalvid.mp4
    video: {
        file: new URL('./template-video.mp4', import.meta.url),
        remotePath: '/sdcard/Movies/auto-template-video.mp4',
        mediaUri: VIDEOS
    },
    // 2.4s, below the 3s minimum; copy of mt-lessthan_3secs.mp4
    videoShort: {
        file: new URL('./template-video-short.mp4', import.meta.url),
        remotePath: '/sdcard/Movies/auto-template-video-short.mp4',
        mediaUri: VIDEOS
    },
    // 17.6s, above the 15s maximum; copy of mt-morethan_15secs.MP4
    videoLong: {
        file: new URL('./template-video-long.mp4', import.meta.url),
        remotePath: '/sdcard/Movies/auto-template-video-long.mp4',
        mediaUri: VIDEOS
    },
}
