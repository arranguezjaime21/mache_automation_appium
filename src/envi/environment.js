import 'dotenv/config';

export const environment = { 
    appiumPort: Number(process.env.APPIUM_PORT),
    deviceName: process.env.DEVICE_NAME, 
    appiumPackage: process.env.APPIUM_PACKAGE,
    appiumActivity: process.env.APPIUM_ACTIVITY,

    userName: process.env.USER_NAME,
    userPassword: process.env.USER_PASSWORD
}