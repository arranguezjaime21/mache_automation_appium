import { expect } from "chai";
import permission from "../screens/permission.js"
import AllureReporter from "@wdio/allure-reporter";

// The tests below walk through the permission dialog in order (camera → mic → bluetooth → notification),
// so the setup runs once per spec rather than per test.
describe('App Permission', () => {


    afterEach(async function() {
        if(this.currentTest.state === 'failed') { 
            const screenshot = await browser.takeScreenshot();

            AllureReporter.addAttachment(
                'Automation Failure Test',
                Buffer.from(screenshot, 'base64'),
                'image/png'
            )
        }
    });
    it('should allow device camera permission', async() => {
        await permission.allowCamera();
        expect(await permission.isCameraPermissionDisabled()).to.be.false;
    });

    it('should allow device mic permission', async() => {
        await permission.allowMic();
        expect(await permission.isMicPermissionDisabled()).to.be.false;
    });

    it('should allow device bluetooth permission', async () => {
        await permission.allowBluetooth();
        expect(await permission.isNotifDialogDisplayed()).to.be.true;
    });

    it('should allow notification permission', async() => {
        await permission.allowNotif();
        expect(await permission.isNotifDialogDismissed()).to.be.true;
    })
})