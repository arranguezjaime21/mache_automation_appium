export const TemplateSelector = {
    myPage: '(//android.widget.ImageView[@resource-id="com.fdc_machetalk_broadcaster:id/icon"])[5]',
    templateSettings: 'id=com.fdc_machetalk_broadcaster:id/linear_layout_template_settings',
    title: 'id=com.fdc_machetalk_broadcaster:id/actionBarTitle', //テンプレート設定
    createHelp: 'id=com.fdc_machetalk_broadcaster:id/create_template_help',//設定後はやり取りしたことがない相手のメッ\nセージ画面に表示され簡単に送信できます。
    createHeader: 'id=com.fdc_machetalk_broadcaster:id/tv_create_header_title', //テンプレートを作成しよう！( 0/30 ) → あなたのテンプレート( 1/30 ) once one exists
    followHelp: 'id=com.fdc_machetalk_broadcaster:id/follow_template_help', //フォローされると自動で相手に送られる\nお礼メッセージです。
    followHeader: 'id=com.fdc_machetalk_broadcaster:id/tv_follow_header_title', //フォローお礼メッセージ
    templateHelp: 'id=com.fdc_machetalk_broadcaster:id/img_template_help', //作成に困ったらおすすめテンプレートに写真\nを添付して簡単に設定できます。
    templateHeader: 'id=com.fdc_machetalk_broadcaster:id/tv_greetings_header_title', //おすすめテンプレート
    balloonText: 'id=com.fdc_machetalk_broadcaster:id/balloon_text',
    helpDialog: 'id=com.fdc_machetalk_broadcaster:id/balloon_card',

    // Template creation (テンプレート作成)
    createTemplate: 'id=com.fdc_machetalk_broadcaster:id/create_template_clickable',
    createTitle: 'id=com.fdc_machetalk_broadcaster:id/tv_header_title', //テンプレート作成
    inputContent: 'id=com.fdc_machetalk_broadcaster:id/et_template_content',
    contentCount: 'id=com.fdc_machetalk_broadcaster:id/tv_count_content', //0 ( / 300 )
    saveTemplate: 'id=com.fdc_machetalk_broadcaster:id/right_button',
    savedMsg: 'id=com.fdc_machetalk_broadcaster:id/message', //テンプレートを保存しました
    savedOk: 'id=com.fdc_machetalk_broadcaster:id/confirmButton',

    // Created template card and delete dialog (テンプレートを削除)
    templateByText: (text) => `//android.widget.TextView[@resource-id="com.fdc_machetalk_broadcaster:id/tv_content" and @text="${text}"]`,
    deleteByText: (text) => `//android.widget.TextView[@resource-id="com.fdc_machetalk_broadcaster:id/tv_content" and @text="${text}"]/ancestor::*[@resource-id="com.fdc_machetalk_broadcaster:id/template_clickable"][1]//*[@resource-id="com.fdc_machetalk_broadcaster:id/btn_delete"]`,
    deleteConfirm: 'id=com.fdc_machetalk_broadcaster:id/rl_dialog_confirm', //削除
}
