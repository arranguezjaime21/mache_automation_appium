import { readFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const ADB = process.env.ANDROID_HOME ? path.join(process.env.ANDROID_HOME, 'platform-tools', 'adb') : 'adb';
const execFileAsync = promisify(execFile);

async function adb(...args) {
    const udid = driver.capabilities.deviceUDID ?? driver.capabilities['appium:udid'];
    const { stdout } = await execFileAsync(ADB, [...(udid ? ['-s', udid] : []), ...args]);
    return stdout;
};

// Pushes one MediaFixture entry (src/fixtures/media.js) onto the device
export async function pushMediaFixture({ file, remotePath, mediaUri }) {
    const data = await readFile(file);
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
