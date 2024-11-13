import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import VideoCard from './components/VideoCard';
import CreateChannel from './components/CreateChannel';
import Home from './components/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './components/routes';
import './App.css'





const App = () => {


  return (
    <Router>
    <div className="roboto bg-[#0F0F0F] flex">
      <Header />
      {/* <Sidebar isCollapsed={true} />  */}
      <div className="flex-grow p-4">
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<route.component />}
              exact={route.exact} 
            />
          ))}
        </Routes>
      </div>
    </div>
  </Router>


  );
};

export default App;
