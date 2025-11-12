import Toast from 'react-native-toast-message';

export class ToastService {
  static success(message: string, title?: string) {
    Toast.show({
      type: 'success',
      text1: title || 'Success',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
    });
  }

  static error(message: string, title?: string) {
    Toast.show({
      type: 'error',
      text1: title || 'Error',
      text2: message,
      position: 'top',
      visibilityTime: 4000,
    });
  }

  static info(message: string, title?: string) {
    Toast.show({
      type: 'info',
      text1: title || 'Info',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
    });
  }

  static warning(message: string, title?: string) {
    Toast.show({
      type: 'error', // Using error type for warning as react-native-toast-message doesn't have warning
      text1: title || 'Warning',
      text2: message,
      position: 'top',
      visibilityTime: 3500,
    });
  }
}