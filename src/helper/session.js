import { environment } from "../envi/environment.js";

// Clears app data (login state, granted permissions) and relaunches the app,
// so a spec never depends on what a previous spec or run left behind.
export async function resetApp() {
    await driver.execute('mobile: clearApp', { appId: environment.appiumPackage });
    await driver.activateApp(environment.appiumPackage);
};


