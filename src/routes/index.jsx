import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import TestComponent from '../components/TestComponent';
import Loader from '../components/Loader';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <Suspense fallback={<Loader />}>
          <TestComponent />
        </Suspense>
      } />
    </Routes>
  );
};

export default AppRoutes;
