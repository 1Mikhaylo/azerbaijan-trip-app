import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TripProvider } from './context/TripContext';
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import MyTripScreen from './screens/MyTripScreen';

export default function App() {
  const [screen, setScreen] = useState('splash');

  return (
    <SafeAreaProvider>
      {screen === 'splash' && (
        <SplashScreen onFinish={() => setScreen('onboarding')} />
      )}
      {screen === 'onboarding' && (
        <OnboardingScreen onFinish={() => setScreen('main')} />
      )}
      {screen === 'main' && (
        <TripProvider>
          <MyTripScreen />
        </TripProvider>
      )}
    </SafeAreaProvider>
  );
}
