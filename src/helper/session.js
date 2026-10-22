import { environment } from "../envi/environment.js";
import loginMain from "../screens/login.main.js";

// Clears app data (login state, granted permissions) and relaunches the app,
// so a spec never depends on what a previous spec or run left behind.
export async function resetApp() {
    await driver.execute('mobile: clearApp', { appId: environment.appiumPackage });
    await driver.activateApp(environment.appiumPackage);
};

// Fresh app, logged in with the valid account; stops at the permission dialog.
export async function resetAndLogin() {
    await resetApp();
    await loginMain.navMailLogin();
    await loginMain.loginFlow({
        email: environment.userName,
        password: environment.userPassword
    });

    if(!(await loginMain.isPermissionDisplayed())) {
        throw new Error('Login setup failed: permission dialog not displayed after login');
    }
};
