import "./init";
import "./App.css";

import {
  BackgroundBlurProvider,
  GlobalStyles,
  MeetingProvider,
  lightTheme,
} from "amazon-chime-sdk-component-library-react";
import { ThemeProvider } from "styled-components";
import Dashboard from "./screens/Dashboard";

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <GlobalStyles />
      <BackgroundBlurProvider>
        <MeetingProvider>
          <Dashboard />
        </MeetingProvider>
      </BackgroundBlurProvider>
    </ThemeProvider>
  );
}

export default App;
