import { PermissionSelector } from "../selectors/permission.js";
import { BasePage } from "./base.js";

class Permission extends BasePage { 
    selector = PermissionSelector;

    async allowCamera() {
        await this.click(this.selector.camera);
        await this.click(this.selector.allowPermission);
    };

    async isCameraPermissionDisabled() { 
        return await this.isElementEnabled(this.selector.camera);
    };

    async allowMic() { 
        await this.click(this.selector.mic);
        await this.click(this.selector.allowPermission);
    };

    async isMicPermissionDisabled() { 
        return await this.isElementEnabled(this.selector.mic);
    };

    async allowBluetooth() { 
        await this.click(this.selector.bluetooth);
        await this.click(this.selector.allowBtn);
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