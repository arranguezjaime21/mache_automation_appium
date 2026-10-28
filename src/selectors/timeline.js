const card = (text) => `//android.widget.TextView[@resource-id="com.fdc_machetalk_broadcaster:id/tv_content" and @text="${text}"]/ancestor::*[@resource-id="com.fdc_machetalk_broadcaster:id/timeline_container"][1]`;

export const TimelineSelector = {
    tabMenu: 'id=com.fdc_machetalk_broadcaster:id/tabMenu', //home tab bar
    timelineTab: '(//android.widget.ImageView[@resource-id="com.fdc_machetalk_broadcaster:id/icon"])[4]',
    title: 'id=com.fdc_machetalk_broadcaster:id/tv_header_title', //タイムライン
    // Pending posts only appear under 自分の投稿, not すべて / フォロー中
    myPostsTab: '//android.widget.TextView[@resource-id="com.fdc_machetalk_broadcaster:id/tab_title" and @text="自分の投稿"]',
    newPost: 'id=com.fdc_machetalk_broadcaster:id/fl_new_post',

    // New post composer
    inputPost: 'id=com.fdc_machetalk_broadcaster:id/et_post_text', //今の気分を投稿しよう
    // Two image slots: [1] opens the camera, [2] the photo library
    uploadImage: '(//*[@resource-id="com.fdc_machetalk_broadcaster:id/fl_image_container"])[2]',
    attachedImage: 'id=com.fdc_machetalk_broadcaster:id/iv_selected_photo', //replaces the image slots once attached
    submitPost: 'id=com.fdc_machetalk_broadcaster:id/btn_confirm', //投稿する

    // Post card in the list, found by its text
    postByText: (text) => card(text),
    approvalMsgByText: (text) => `${card(text)}//*[@resource-id="com.fdc_machetalk_broadcaster:id/tv_for_approval_message"]`, //スタッフが内容を確認中です\n承認後、投稿されます。
    approvalOverlayByText: (text) => `${card(text)}//*[@resource-id="com.fdc_machetalk_broadcaster:id/ll_transparent_overlay"]`,
    // Only rendered once approved; pending image posts show no image
    imageByText: (text) => `${card(text)}//*[@resource-id="com.fdc_machetalk_broadcaster:id/timeline_image"]`,
}
