import { NavigationContainer } from 'react-navigation';

declare module 'react-navigation' {
  export function createAppContainer(stackContainer: NavigationContainer);
}
