import AppContent from '@/AppContent/AppContent';
import { AppProvider } from '@/components/AppProvider';


export default function App() {

  return (
    <AppProvider>
     <AppContent/>
    </AppProvider>
  );
}
