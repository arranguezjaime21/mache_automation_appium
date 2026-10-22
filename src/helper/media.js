import { readFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const FIXTURES = new URL('../fixtures/', import.meta.url);
const ADB = process.env.ANDROID_HOME ? path.join(process.env.ANDROID_HOME, 'platform-tools', 'adb') : 'adb';
const execFileAsync = promisify(execFile);

// Fixture files carry no "date taken", so after a push the photo picker sorts them by push time,
// i.e. first in the grid. The video is 8s / 1.6MB, inside the app's accepted 3–15s and 50MB limits.
export const MediaFixture = {
    image: { file: 'template-image.png', remotePath: '/sdcard/Pictures/auto-template-image.png', mediaUri: 'content://media/external/images/media' },
    video: { file: 'template-video.mp4', remotePath: '/sdcard/Movies/auto-template-video.mp4', mediaUri: 'content://media/external/video/media' },
    // Outside the accepted range; copies of the QA videos mt-lessthan_3secs.mp4 (2.4s) and mt-morethan_15secs.MP4 (17.6s)
    videoShort: { file: 'template-video-short.mp4', remotePath: '/sdcard/Movies/auto-template-video-short.mp4', mediaUri: 'content://media/external/video/media' },
    videoLong: { file: 'template-video-long.mp4', remotePath: '/sdcard/Movies/auto-template-video-long.mp4', mediaUri: 'content://media/external/video/media' },
};

async function adb(...args) {
    const udid = driver.capabilities.deviceUDID ?? driver.capabilities['appium:udid'];
    const { stdout } = await execFileAsync(ADB, [...(udid ? ['-s', udid] : []), ...args]);
    return stdout;
};

export async function pushMediaFixture({ file, remotePath, mediaUri }) {
    const data = await readFile(new URL(file, FIXTURES));
    await driver.pushFile(remotePath, data.toString('base64'));

    // pushFile's own media scan can leave the record incomplete (size/duration NULL), and the
    // picker hides such files, so the test would pick the user's newest media instead
    await adb('shell', 'am', 'broadcast', '-a', 'android.intent.action.MEDIA_SCANNER_SCAN_FILE', '-d', `file://${remotePath}`);
    await browser.waitUntil(async() => {
        const row = await adb('shell', `content query --uri ${mediaUri} --projection _size --where "_display_name='${path.posix.basename(remotePath)}'"`);
        return row.includes('_size=') && !row.includes('_size=NULL');
    }, {
        timeout: 15000,
        timeoutMsg: `${remotePath} was not indexed by the media store`
    });
};
