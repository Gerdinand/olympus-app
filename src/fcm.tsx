import { Platform } from 'react-native';
// tslint:disable-next-line:max-line-length
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm';

// this shall be called regardless of app state: running, background
// or not running. Won't be called when app is killed by user in iOS
FCM.on(FCMEvent.Notification, async (notif) => {
    // there are two parts of notif. notif.notification contains the notification payload,
    // notif.data contains data payload
    if (notif.local_notification) {
        // this is a local notification
    }
    if (notif.opened_from_tray) {
        // iOS: app is open/resumed because user clicked banner
        // Android: app is open/resumed because user clicked banner or tapped app icon
    }
    // await someAsyncCall();

    if (Platform.OS === 'ios') {
        if (notif._actionIdentifier === 'com.myapp.MyCategory.Confirm') {
            // handle notification action here
            // the text from user is in notif._userText if type of the action is NotificationActionType.TextInput
        }
        // optional
        // iOS requires developers to call completionHandler to end notification process.
        // If you do not call it your background remote notifications could be throttled,to read more about it see
        // https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1623013-application.
        // This library handles it for you automatically with default behavior
        // (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground").
        // However if you want to return different result, follow the following code to override
        // notif._notificationType is available for iOS platfrom
        switch (notif._notificationType) {
            case NotificationType.Remote:
                // other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
                notif.finish(RemoteNotificationResult.NewData);
                break;
            case NotificationType.NotificationResponse:
                notif.finish();
                break;
            case NotificationType.WillPresent:
                // other types available: WillPresentNotificationResult.None
                notif.finish(WillPresentNotificationResult.All);
                break;
        }
    }
});
FCM.on(FCMEvent.RefreshToken, (token) => {
    console.log(token);
    // fcm token may not be available on first load, catch it here
});

export { FCM, FCMEvent };
