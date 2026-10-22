export class BasePage {
    async waitAndFind(selector) {
        const el = $(selector);
        await el.waitForExist();
        return el;
    };

    async waitAndFindVisible(selector) {
        const el = $(selector);
        await el.waitForDisplayed();
        return el;
    };

    async waitAndFindAll(selector) {
        let elements = [];
        await browser.waitUntil(async() => {
            elements = await $$(selector);
            return elements.length > 0;
        }, {
            timeout: 15000,
            timeoutMsg: `${selector} not found or does not exist`
        });

        for(const element of elements) {
            await element.waitForDisplayed();
        }

        return elements;
    };

    async click(selector) {
        const el = await this.waitAndFindVisible(selector);
        await el.click();
    };

    async setValue(selector, value) {
        const el = await this.waitAndFindVisible(selector);
        await el.setValue(value);
    };

    async getText(selector) {
        const el = await this.waitAndFindVisible(selector);
        return await el.getText();
    };

    async isElementEnabled(selector) {
        const el = await this.waitAndFind(selector);
        return await el.isEnabled();
    };

    // Returns false instead of throwing when the element never appears
    async isElementExist(selector, timeout) {
        try {
            await $(selector).waitForExist({ timeout });
            return true;
        } catch {
            return false;
        }
    };

    // Returns false instead of throwing when the element never becomes visible
    async isElementVisible(selector, timeout) {
        try {
            await $(selector).waitForDisplayed({ timeout });
            return true;
        } catch {
            return false;
        }
    };

    async isElementDisplayed(selector, timeout) {
        return await this.isElementVisible(selector, timeout);
    };

    // Waits for the element to disappear; returns false if it is still shown after the timeout
    async isElementGone(selector, timeout) {
        try {
            await $(selector).waitForDisplayed({ timeout, reverse: true });
            return true;
        } catch {
            return false;
        }
    };
}
