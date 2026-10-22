import { LoginSelectors } from "../selectors/login.js";
import { BasePage } from "./base.js";

class LoginMain extends BasePage { 
    selector = LoginSelectors;

    async navMailLogin() { 
        await this.click(this.selector.navLogin);
        await this.click(this.selector.mailMethod);
        await this.click(this.selector.mailLogin);
    }

    async inputUserEmail(email) { 
        await this.setValue(this.selector.inputEmail, email);
    }

    async inputUserPassword(password) { 
        await this.setValue(this.selector.inputPass, password);
    }

    async clickLogin() { 
        await this.click(this.selector.loginBtn);
    }

    async loginFlow({email, password}) { 
        await this.inputUserEmail(email);
        await this.inputUserPassword(password);
        await this.clickLogin();
    }

    async isLoginBtnEnabled() { 
        return await this.isElementEnabled(this.selector.loginBtn);
    }

    async getErrMsg() {
        return await this.getText(this.selector.errMsg);
    }

    async isErrMsgDisplayed() {
         return await this.isElementVisible(this.selector.errMsg);
    }

    async isPermissionDisplayed() { 
        return await this.isElementVisible(this.selector.permission);
    }
    
}

export default new LoginMain();