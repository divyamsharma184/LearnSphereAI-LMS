import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="main-layout">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="content-wrapper">
        {/* Only show sidebar when user is authenticated */}
        {isAuthenticated && (
          <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : ''}`}>
            <Sidebar 
              isOpen={sidebarOpen} 
              onClose={() => setSidebarOpen(false)} 
            />
          </div>
        )}
        
        <main className={`main-content ${isAuthenticated ? 'with-sidebar' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;