import { TemplateSelector } from "../selectors/template.js";
import { BasePage } from "./base.js";

class TemplateMain extends BasePage { 
    selector = TemplateSelector;


    async navTemplateSettings() { 
        await this.click(this.selector.myPage);
        await this.click(this.selector.templateSettings);
    };
    async templateSettingsTitle() { 
        await this.isElementVisible(this.selector.title);
    };

    async creationHelpDialog() { 
        await this.click(this.selector.createHelp);
    };

    async followHelpDialog() { 
        await this.click(this.selector.followHelp);
    };

    async templateHelpDialog() { 
        await this.click(this.selector.templateHelp);
    };

    async isHelpDialogDisplay() { 
        return await this.isElementVisible(this.selector.helpDialog);
    };

    async getDialogText() {
        return await this.getText(this.selector.balloonText);
    };

    async getCreationHeaderText() { 
        return await this.getText(this.selector.createHeader);
    };

    async getFollowHeaderText() { 
        return await this.getText(this.selector.followHeader);
    };

    async getTemplateHeaderText() { 
        return await this.getText(this.selector.templateHeader);
    };

    async getTemplateCount() {
        const text = await this.getCreationHeaderText();
        const match = text.match(/\(\s*(\d+)\s*\/\s*(\d+)\s*\)/);

        if(!match) { 
            throw new Error(`unable to parse template count from: ${text}`);
        }

        return {
            current: Number(match[1]),
            maximum: Number(match[2]),
        }
    }

}
export default new TemplateMain();