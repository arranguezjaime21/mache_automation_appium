export const PhotoPickerSelector = {
    // Android system photo picker (no resource ids; device language is English)
    firstPhoto: '(//*[starts-with(@content-desc, "Photo taken on")])[1]',
    firstVideo: '(//*[starts-with(@content-desc, "Video taken on")])[1]',
    done: '//android.widget.TextView[@text="Done"]',

    // App crop screen shown after picking a photo (枠内にお顔全体が入るように設定してください)
    cropUsePhoto: 'id=com.fdc_machetalk_broadcaster:id/tv_use_photo', //選択
}
