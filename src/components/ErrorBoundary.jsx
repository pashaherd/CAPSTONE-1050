import React, { useState, useEffect } from 'react';

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleErrors = (error, errorInfo) => {
      console.error('Error caught by error boundary:', error, errorInfo);
      setHasError(true);
    };

    window.addEventListener('error', handleErrors);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('error', handleErrors);
    };
  }, []);

  if (hasError) {
    // You can customize the fallback UI here
    return <div>Something went wrong!</div>;
  }

  return <>{children}</>;
};

export default ErrorBoundary;
