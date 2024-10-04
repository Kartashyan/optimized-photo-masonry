import React from 'react';
import { useRouteError } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  const error = useRouteError();
  console.error('Error caught by ErrorPage:', error);

  return (
    <div>
      <h1>Oops! An error occurred.</h1>
      <p>{(error as Error).message || 'Unknown error'}</p>
    </div>
  );
};

export default ErrorPage;