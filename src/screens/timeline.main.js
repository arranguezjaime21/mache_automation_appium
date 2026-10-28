import { TimelineSelector } from "../selectors/timeline.js";
import { BasePage } from "./base.js";
import photoPicker from "./photo.picker.js";

export const PostStatus = {
    WAITING_APPROVAL: 'waiting for approval',
    APPROVED: 'approved',
};

class TimelineMain extends BasePage {
    selector = TimelineSelector;

    // The app may be on another screen (e.g. Template Settings left by the previous spec, or profile
    // edit opened on launch), and a new session's launch can switch back to home after a first tap.
    // Back returns to the home tab bar; repeat until the timeline is actually showing.
    async navTimeline() { 
        await browser.waitUntil(async() => {
            if(await this.isElementVisible(this.selector.newPost, 3000)) return true;

            if(await this.isElementVisible(this.selector.tabMenu, 3000)) {
                await this.click(this.selector.timelineTab);
            } else {
                await driver.back();
            }
            return false;
        }, {
            timeout: 60000,
            interval: 1000,
            timeoutMsg: 'Timeline screen not reached'
        });
    };

    // Right after posting the timeline reloads and jumps back to すべて, which can swallow a tap,
    // so keep tapping until the tab is actually selected
    async openMyPosts() { 
        await browser.waitUntil(async() => {
            await this.click(this.selector.myPostsTab);
            return (await $(this.selector.myPostsTab).getAttribute('selected')) === 'true';
        }, {
            timeout: 20000,
            interval: 2000,
            timeoutMsg: '自分の投稿 tab was not selected'
        });
    };

    // Retries from the timeline if the app jumped away before the composer opened
    async openNewPost() { 
        await browser.waitUntil(async() => {
            await this.navTimeline();
            await this.click(this.selector.newPost);
            return await this.isElementVisible(this.selector.inputPost, 5000);
        }, {
            timeout: 60000,
            interval: 1000,
            timeoutMsg: 'New post composer did not open'
        });
    };

    async inputPostText(text) {
        await this.setValue(this.selector.inputPost, text);
    };

    // Picks the newest photo, i.e. the fixture pushed by pushMediaFixture()
    async attachImageFromGallery() {
        await this.click(this.selector.uploadImage);
        await photoPicker.pickNewestPhoto();
        await this.waitAndFindVisible(this.selector.attachedImage, 20000);
    };

    async isImageAttached() {
        return await this.isElementVisible(this.selector.attachedImage);
    };

    // No confirmation dialog: the composer closes and the list reloads with the new post on top
    async submitPost() {
        await this.click(this.selector.submitPost);
        await this.isElementGone(this.selector.submitPost, 30000);
    };

    async isPostDisplayed(text) {
        return await this.isElementVisible(this.selector.postByText(text), 30000);
    };

    // Approval is done by staff, so a fresh post is normally still waiting
    async getPostStatus(text) {
        await this.waitAndFindVisible(this.selector.postByText(text), 30000);
        return await this.isElementVisible(this.selector.approvalMsgByText(text), 2000)
            ? PostStatus.WAITING_APPROVAL
            : PostStatus.APPROVED;
    };

    async getApprovalMsg(text) {
        return await this.getText(this.selector.approvalMsgByText(text));
    };

    async isApprovalOverlayDisplayed(text) {
        return await this.isElementVisible(this.selector.approvalOverlayByText(text), 2000);
    };

    async isPostImageDisplayed(text) {
        return await this.isElementVisible(this.selector.imageByText(text));
    };
}

export default new TimelineMain();
