import React, { useState, useEffect } from 'react';
import PortalHome from './components/PortalHome';
import KioskView from './components/KioskView';
import MobileView from './components/MobileView';

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  // Monitor browser back/forward and routing changes
  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    
    // Intercept pushState routing changes
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      originalPushState.apply(this, args);
      handleLocationChange();
    };

    // Intercept replaceState routing changes
    const originalReplaceState = history.replaceState;
    history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      handleLocationChange();
    };

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  // Simple router dispatch
  if (path === '/kiosk') {
    return <KioskView />;
  } else if (path === '/join') {
    return <MobileView />;
  } else {
    return <PortalHome />;
  }
}
