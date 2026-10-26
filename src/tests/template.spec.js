import { expect } from "chai";
import templateMain from "../screens/template.main.js"
import AllureReporter from "@wdio/allure-reporter";
import { pushMediaFixture } from "../helper/media.js";
import { MediaFixture } from "../fixtures/media.js";
import { TemplateMessages } from "../messages/template.js";

describe('Template Settings', () => {
    // Unique per test so cleanup only ever deletes what the test itself created
    let templateText;

    before(async () => {
       
        await templateMain.navTemplateSettings();
    });

    beforeEach(function () {
        templateText = `auto-template-${Date.now()}`;
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
        await templateMain.discardCreateIfOpen();

        // Keep the account under the 30-template limit across runs
        if(await templateMain.isTemplateDisplayed(templateText, 3000)) {
            await templateMain.deleteTemplate(templateText);
        };
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

    describe('Template count', () => {

        it('should increase template count after creating a template', async() => {
            const before = await templateMain.getTemplateCount();

            await templateMain.createTemplate(templateText);
            expect(await templateMain.getSavedMsg()).to.equal(TemplateMessages.saved);
            await templateMain.closeSavedDialog();

            expect(await templateMain.waitForTemplateCount(before.current + 1)).to.be.true;
            expect(await templateMain.isTemplateDisplayed(templateText)).to.be.true;
        });

        it('should decrease template count after deleting a created template', async() => {
            await templateMain.createTemplate(templateText);
            await templateMain.closeSavedDialog();
            expect(await templateMain.isTemplateDisplayed(templateText)).to.be.true;
            const before = await templateMain.getTemplateCount();

            await templateMain.deleteTemplate(templateText);

            expect(await templateMain.isTemplateGone(templateText)).to.be.true;
            expect(await templateMain.waitForTemplateCount(before.current - 1)).to.be.true;
        });
    });

    describe('Template with media', () => {

        // Pushed fixtures become the newest items, so the picker steps select them and not personal media
        before(async () => {
            await pushMediaFixture(MediaFixture.image);
            await pushMediaFixture(MediaFixture.video);
        });

        const mediaCases = [
            { attached: 'an image', media: { image: true } },
            { attached: 'a video', media: { video: true } },
            { attached: 'an image and a video', media: { image: true, video: true } },
        ];

        mediaCases.forEach(({ attached, media }) => {
            it(`should create a template with ${attached}`, async() => {
                const before = await templateMain.getTemplateCount();

                await templateMain.createTemplate(templateText, media);
                expect(await templateMain.getSavedMsg()).to.equal(TemplateMessages.saved);
                await templateMain.closeSavedDialog();

                expect(await templateMain.waitForTemplateCount(before.current + 1)).to.be.true;
                expect(await templateMain.isTemplateDisplayed(templateText)).to.be.true;
                expect(await templateMain.isTemplateImageDisplayed(templateText)).to.equal(!!media.image);
                expect(await templateMain.isTemplateVideoDisplayed(templateText)).to.equal(!!media.video);
            });
        });
    });

    describe('Video duration validation', () => {
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
                // Pushed right before picking so this fixture is the newest video in the picker
                await pushMediaFixture(fixture);

                await templateMain.openCreateTemplate();
                await templateMain.pickVideoFromGallery();
                expect(await templateMain.getUploadErrorMsg()).to.equal(error);

                await templateMain.closeUploadError();
                expect(await templateMain.isVideoAttached(3000)).to.be.false;
            });
        });
    });
})
