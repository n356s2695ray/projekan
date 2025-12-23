import { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { darkModeManager } from "./utils/darkModeManager";

const Layout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(darkModeManager.getDarkMode());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const unsubscribe = darkModeManager.subscribe(setDarkMode);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024;
      if (isDesktop) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        {/* Sidebar */}
        <Sidebar
          darkMode={darkMode}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <div
            className={`
              flex-1 transition-all duration-300
              ${sidebarOpen ? (sidebarCollapsed ? "lg:ml-20" : "lg:ml-64") : ""}
            `}
          >
            <Header
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              sidebarCollapsed={sidebarCollapsed}
              setSidebarCollapsed={setSidebarCollapsed}
            />
            <main className="p-4 sm:p-6 lg:p-8 w-full overflow-x-hidden flex-1">
              <div className="max-w-full mx-auto">
                {children}
              </div>
            </main>
          </div>

          {/* Footer */}
          <div
            className={`
              transition-all duration-300
              ${sidebarOpen ? (sidebarCollapsed ? "lg:ml-20" : "lg:ml-64") : ""}
            `}
          >
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;