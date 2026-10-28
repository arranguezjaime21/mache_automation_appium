import { PermissionSelector } from "../selectors/permission.js";
import { BasePage } from "./base.js";

class Permission extends BasePage { 
    selector = PermissionSelector;

    // A tap made while a new session is relaunching the app can be lost, so tap the app's button
    // again until the system dialog shows. Only taps while the button is visible, so a retry never
    // lands on the system dialog itself.
    async requestPermission(button, allowSelector) { 
        await browser.waitUntil(async() => {
            if(await this.isElementVisible(allowSelector, 3000)) return true;
            if(await this.isElementVisible(button, 1000)) await $(button).click();
            return false;
        }, {
            timeout: 30000,
            interval: 1000,
            timeoutMsg: `system permission dialog did not open from ${button}`
        });
        await this.click(allowSelector);
    };

    async allowCamera() {
        await this.requestPermission(this.selector.camera, this.selector.allowPermission);
    };

    async isCameraPermissionDisabled() { 
        return await this.isElementEnabled(this.selector.camera);
    };

    async allowMic() { 
        await this.requestPermission(this.selector.mic, this.selector.allowPermission);
    };

    async isMicPermissionDisabled() { 
        return await this.isElementEnabled(this.selector.mic);
    };

    async allowBluetooth() { 
        await this.requestPermission(this.selector.bluetooth, this.selector.allowBtn);
    };

    async allowNotif() { 
        await this.click(this.selector.allowBtn);
    };

    async isNotifDialogDisplayed() { 
        return await this.isElementVisible(this.selector.notifDialog);
    };

    async isNotifDialogDismissed() {
        return await this.isElementGone(this.selector.notifDialog);
    };
}

export default new Permission();