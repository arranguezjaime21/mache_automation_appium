import { PhotoPickerSelector } from "../selectors/photo.picker.js";
import { BasePage } from "./base.js";

// System photo picker shared by every upload flow (templates, timeline).
// It always takes the newest item, i.e. the fixture just pushed by pushMediaFixture().
class PhotoPicker extends BasePage {
    selector = PhotoPickerSelector;

    async pickNewestPhoto() {
        await this.click(this.selector.firstPhoto);
        await this.click(this.selector.done);
        await this.click(this.selector.cropUsePhoto);
    };

    // Videos skip the crop screen
    async pickNewestVideo() {
        await this.click(this.selector.firstVideo);
        await this.click(this.selector.done);
    };
}

export default new PhotoPicker();
