import { TemplateSelector } from "../selectors/template.js";
import { BasePage } from "./base.js";

class TemplateMain extends BasePage { 
    selector = TemplateSelector;


    async navTemplateSettings() { 
        await this.click(this.selector.myPage);
        await this.click(this.selector.templateSettings);
        // Template list loads from the server; on a fresh login this can exceed the default 10s
        await this.waitAndFindVisible(this.selector.createHeader, 30000);
    };
    async templateSettingsTitle() {
        return await this.isElementVisible(this.selector.title);
    };

    async creationHelpDialog() { 
        return await this.openHelpDialog(this.selector.createHelp);
    };

    async followHelpDialog() { 
        return await this.openHelpDialog(this.selector.followHelp);
    };

    async templateHelpDialog() { 
        return await this.openHelpDialog(this.selector.templateHelp);
    };

    async isHelpDialogDisplay() { 
        return await this.isElementVisible(this.selector.helpDialog);
    };

    async isHelpDialogHidden() { 
        return await this.isElementGone(this.selector.helpDialog);
    };

    // Taps a ? icon and returns where it was tapped. While the balloon is open the page
    // behind it is not in the UI hierarchy, so closing re-taps that saved position.
    async openHelpDialog(selector) { 
        const el = await this.waitAndFindVisible(selector);
        const { x, y } = await el.getLocation();
        const { width, height } = await el.getSize();
        const point = { x: Math.round(x + width / 2), y: Math.round(y + height / 2) };
        await el.click();
        return point;
    };

    async closeHelpDialog(point) { 
        await driver.execute('mobile: clickGesture', point);
    };

    // Recovery for a failed test that left a balloon open; Back only dismisses the balloon
    async dismissHelpDialogIfOpen() { 
        if(await this.isElementVisible(this.selector.helpDialog, 1000)) {
            await driver.back();
            await this.isHelpDialogHidden();
        }
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

    // The header refreshes after the save dialog closes, so poll instead of reading once
    async waitForTemplateCount(expected, timeout = 10000) {
        try {
            await browser.waitUntil(async() => (await this.getTemplateCount()).current === expected, { timeout });
            return true;
        } catch {
            return false;
        }
    };

    async openCreateTemplate() {
        await this.click(this.selector.createTemplate);
    };

    async inputTemplateContent(text) {
        await this.setValue(this.selector.inputContent, text);
    };

    async saveTemplate() {
        await this.click(this.selector.saveTemplate);
    };

    async getSavedMsg() {
        return await this.getText(this.selector.savedMsg);
    };

    async closeSavedDialog() {
        await this.click(this.selector.savedOk);
        await this.isElementGone(this.selector.savedOk);
    };

    async createTemplate(text) {
        await this.openCreateTemplate();
        await this.inputTemplateContent(text);
        await this.saveTemplate();
    };

    async isTemplateDisplayed(text, timeout) {
        return await this.isElementVisible(this.selector.templateByText(text), timeout);
    };

    async isTemplateGone(text) {
        return await this.isElementGone(this.selector.templateByText(text));
    };

    async deleteTemplate(text) {
        await this.click(this.selector.deleteByText(text));
        await this.click(this.selector.deleteConfirm);
        // The list re-renders after deletion; taps made before it settles are lost
        await this.isTemplateGone(text);
    };

}
export default new TemplateMain();