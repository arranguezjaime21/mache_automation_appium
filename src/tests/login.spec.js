import { expect } from "chai";
import loginMain from "../screens/login.main.js"
import { environment } from "../envi/environment.js";
import { LoginMessages } from "../messages/login.js";
import AllureReporter from "@wdio/allure-reporter";
import { resetApp } from "../helper/session.js";

describe('Login', () => {

    beforeEach(async () => {
        await resetApp();
        await loginMain.navMailLogin();
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
    describe('Login Screen Validation',() => {
        
        it('should enable login button when email and password are populated', async() => {
            await loginMain.inputUserEmail('usermail@mail.com');
            expect(await loginMain.isLoginBtnEnabled()).to.be.false;
            await loginMain.inputUserPassword('admin');
            expect(await loginMain.isLoginBtnEnabled()).to.be.true;
        });
    });

    describe('Login validation', () => {
        it('should display error message using invalid credentials', async() => {
            await loginMain.loginFlow({
                email: environment.userName,
                password: "wrong-password"
            });

            expect(await loginMain.isErrMsgDisplayed()).to.be.true;
            expect(await loginMain.getErrMsg()).to.equal(LoginMessages.invalidCredentials);
        });

        it('should successfully login using valid credentials', async() => {
            await loginMain.loginFlow({
                email: environment.userName, 
                password: environment.userPassword
            });

            expect(await loginMain.isPermissionDisplayed()).to.be.true;
        })
    })
})