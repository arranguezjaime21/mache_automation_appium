import { expect } from "chai";
import timelineMain, { PostStatus } from "../screens/timeline.main.js"
import AllureReporter from "@wdio/allure-reporter";
import { pushMediaFixture } from "../helper/media.js";
import { MediaFixture } from "../fixtures/media.js";
import { TimelineMessages } from "../messages/timeline.js";

// Posts are kept after the run (staging); each run uses unique text so it only checks its own posts
describe('Timeline', () => {

    before(async () => {
        await timelineMain.navTimeline();
    });

    afterEach(async function () {
        if(this.currentTest.state === 'failed') {
            const screenshot = await browser.takeScreenshot();

            AllureReporter.addAttachment(
                'Automation Failure Test',
                Buffer.from(screenshot, 'base64'),
                'image/png'
            )
        };
    });

    const posts = [
        { content: 'text', image: false },
        { content: 'text and an image', image: true },
    ];

    posts.forEach(({ content, image }) => {
        // The two steps share the post they create, so they run in order
        describe(`Post with ${content}`, () => {
            const postText = `auto-timeline-${image ? 'image' : 'text'}-${Date.now()}`;

            it(`should post ${content} and display it in my posts`, async() => {
                await timelineMain.openNewPost();
                await timelineMain.inputPostText(postText);

                if(image) {
                    await pushMediaFixture(MediaFixture.image);
                    await timelineMain.attachImageFromGallery();
                    expect(await timelineMain.isImageAttached()).to.be.true;
                };

                await timelineMain.submitPost();
                await timelineMain.openMyPosts();
                expect(await timelineMain.isPostDisplayed(postText)).to.be.true;
            });

            it('should show the post as waiting for approval, or without the status once approved', async() => {
                const status = await timelineMain.getPostStatus(postText);
                AllureReporter.addStep(`Post status: ${status}`);

                if(status === PostStatus.WAITING_APPROVAL) {
                    expect(await timelineMain.getApprovalMsg(postText)).to.equal(TimelineMessages.waitingApproval);
                    expect(await timelineMain.isApprovalOverlayDisplayed(postText)).to.be.true;
                } else {
                    // Approved posts display normally, without the overlay or the approval message
                    expect(await timelineMain.isApprovalOverlayDisplayed(postText)).to.be.false;
                    if(image) {
                        expect(await timelineMain.isPostImageDisplayed(postText)).to.be.true;
                    };
                };
            });
        });
    });
})
