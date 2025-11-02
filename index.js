import {AppRegistry} from 'react-native';
import notifee, {EventType} from '@notifee/react-native';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';
import { handleBackgroundMessage } from './src/notifications';

const msg = getMessaging();

setBackgroundMessageHandler(msg, async (remoteMessage) => {
  await handleBackgroundMessage(remoteMessage);
});

notifee.onBackgroundEvent(async ({ type }) => {
  if (type === EventType.PRESS) {
  }
});

AppRegistry.registerComponent(appName, () => App);
