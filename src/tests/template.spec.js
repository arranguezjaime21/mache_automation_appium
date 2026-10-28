import { expect } from "chai";
import templateMain from "../screens/template.main.js"
import AllureReporter from "@wdio/allure-reporter";
import { pushMediaFixture } from "../helper/media.js";
import { MediaFixture } from "../fixtures/media.js";
import { TemplateMessages } from "../messages/template.js";

describe('Template Settings', () => {

    before(async () => {
        await templateMain.navTemplateSettings();
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

        // A balloon left open by a failed test blocks taps on the page behind it
        await templateMain.dismissHelpDialogIfOpen();
    });

    describe('Help dialogs', () => {
        const helpDialogs = [
            {
                section: 'template creation',
                open: () => templateMain.creationHelpDialog(),
                text: TemplateMessages.createHelp
            },
            {
                section: 'follow thank-you message',
                open: () => templateMain.followHelpDialog(),
                text: TemplateMessages.followHelp
            },
            {
                section: 'recommended template',
                open: () => templateMain.templateHelpDialog(),
                text: TemplateMessages.templateHelp
            },
        ];

        helpDialogs.forEach(({ section, open, text }) => {
            it(`should show the ${section} help dialog on tapping ? and hide it on tapping again`, async() => {
                const helpIcon = await open();
                expect(await templateMain.isHelpDialogDisplay()).to.be.true;
                expect(await templateMain.getDialogText()).to.equal(text);

                await templateMain.closeHelpDialog(helpIcon);
                expect(await templateMain.isHelpDialogHidden()).to.be.true;
            });
        });
    });

    // One create form and the template it saves are shared by the steps below, so they run in order:
    // rejected videos → valid attachments → save (count +1) → delete (count -1)
    describe('Template creation with media', () => {
        const templateText = `auto-template-${Date.now()}`;
        let initialCount;

        before(async () => {
            initialCount = (await templateMain.getTemplateCount()).current;
            await templateMain.openCreateTemplate();
            await templateMain.inputTemplateContent(templateText);
        });

        after(async () => {
            // Keep the account under the 30-template limit if a step failed before deletion
            await templateMain.discardCreateIfOpen();
            if(await templateMain.isTemplateDisplayed(templateText, 3000)) {
                await templateMain.deleteTemplate(templateText);
            };
        });

        // The app accepts 3–15s videos; anything outside is rejected before upload
        const rejectedVideos = [
            {
                length: 'under 3 seconds',
                fixture: MediaFixture.videoShort,
                error: TemplateMessages.videoTooShort
            },
            {
                length: 'over 15 seconds',
                fixture: MediaFixture.videoLong,
                error: TemplateMessages.videoTooLong
            },
        ];

        rejectedVideos.forEach(({ length, fixture, error }) => {
            it(`should reject a video ${length} with an error message`, async() => {
                // Each fixture is pushed right before picking so it is the newest video in the picker
                await pushMediaFixture(fixture);
                await templateMain.pickVideoFromGallery();
                expect(await templateMain.getUploadErrorMsg()).to.equal(error);

                await templateMain.closeUploadError();
                expect(await templateMain.isVideoAttached(3000)).to.be.false;
            });
        });

        it('should attach an image', async() => {
            await pushMediaFixture(MediaFixture.image);
            await templateMain.attachImageFromGallery();
            expect(await templateMain.isImageAttached()).to.be.true;
        });

        it('should attach a video between 3 and 15 seconds', async() => {
            await pushMediaFixture(MediaFixture.video);
            await templateMain.attachVideoFromGallery();
            expect(await templateMain.isVideoAttached()).to.be.true;
        });

        it('should increase template count after saving the template', async() => {
            await templateMain.saveTemplate();
            expect(await templateMain.getSavedMsg()).to.equal(TemplateMessages.saved);
            await templateMain.closeSavedDialog();

            expect(await templateMain.waitForTemplateCount(initialCount + 1)).to.be.true;
            expect(await templateMain.isTemplateDisplayed(templateText)).to.be.true;
            expect(await templateMain.isTemplateImageDisplayed(templateText)).to.be.true;
            expect(await templateMain.isTemplateVideoDisplayed(templateText)).to.be.true;
        });

        it('should decrease template count after deleting the template', async() => {
            await templateMain.deleteTemplate(templateText);

            expect(await templateMain.isTemplateGone(templateText)).to.be.true;
            expect(await templateMain.waitForTemplateCount(initialCount)).to.be.true;
        });
    });
})
