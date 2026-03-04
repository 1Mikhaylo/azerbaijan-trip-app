import { TripProvider } from './context/TripContext';
import MyTripScreen from './screens/MyTripScreen';

export default function App() {
  return (
    <TripProvider>
      <MyTripScreen />
    </TripProvider>
  );
}
