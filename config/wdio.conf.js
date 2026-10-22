import { environment } from "../src/envi/environment.js";

export const config = {
    
    runner: 'local',
    port: environment.appiumPort,
    
    specs: [
        "../src/tests/login.spec.js",
        "../src/tests/permission.spec.js",
    ],
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],
    
    maxInstances: 1,
   
    capabilities: [{
        "platformName": "Android",
        "appium:automationName": "UiAutomator2",
        "appium:deviceName": environment.deviceName,
        "appium:appPackage": environment.appiumPackage,
        "appium:appActivity": environment.appiumActivity,
        // App state is reset per spec via src/helper/session.js; permissions are left ungranted
        // so permission.spec.js can exercise the grant flow.
        "appium:noReset": true
    }],

    logLevel: 'error',
   
    bail: 0,
   
    waitforTimeout: 10000,
    
    connectionRetryTimeout: 120000,
    
    connectionRetryCount: 3,
    
    services: ['appium'],
    
    framework: 'mocha',
    
    reporters: ['spec',['allure', {outputDir: 'allure-results'}]],

    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },

    
    afterTest: async function(test, context, { error, result, duration, passed, retries }) {
        if (!passed) {
            await browser.takeScreenshot();
        }
    },

}
