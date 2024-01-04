import './init';
import './App.css';

import {
  BackgroundBlurProvider,
  GlobalStyles,
  MeetingProvider,
  lightTheme,
} from 'amazon-chime-sdk-component-library-react';
import { ThemeProvider } from 'styled-components';
import Dashboard from './screens/Dashboard';
import { ListUsers } from './screens/ListUsers';
import { Controls } from './screens/Controls';

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <GlobalStyles />
      <BackgroundBlurProvider>
        <MeetingProvider>
          <div className="">
            <div className="">
              <div className="w-3/4 h-[90vh]  flex justify-center items-center">
                <Dashboard />
              </div>
              <div className="w-1/4 h-[90vh]">
                <ListUsers />
              </div>
            </div>
            <Controls />
          </div>
        </MeetingProvider>
      </BackgroundBlurProvider>
    </ThemeProvider>
  );
}

export default App;
