import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Desktop } from "./components/desktop";
import { AppContextProvider } from "./context/app-context";
import { DataProvider } from "./context/data-context";
import { ErrorBoundary } from "./components/error-boundary";
import { NotificationProvider } from "./components/notification-provider";

function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <Router>
          <DataProvider>
            <AppContextProvider>
              <Desktop />
            </AppContextProvider>
          </DataProvider>
        </Router>
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default App;
