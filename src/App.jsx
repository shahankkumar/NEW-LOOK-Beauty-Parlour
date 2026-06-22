import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// Component Imports
import PageLoader from './components/PageLoader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import About from './components/About';
import Services from './components/Services';
import Timeline from './components/Timeline';
import Stylists from './components/Stylists';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import WeeklySchedule from './components/WeeklySchedule';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  useEffect(() => {
    // Check local storage for persistent admin state (optional, let's keep it simple and require login each time for security simulation)
    // Simulate loading delay for premium assets & fonts
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-darkBg text-neutral-100 min-h-screen relative selection-luxury selection:bg-neonOrange/30 selection:text-neonOrange">
      {/* Premium Loader Overlay */}
      <AnimatePresence mode="wait">
        {isLoading && <PageLoader key="loader" />}
      </AnimatePresence>

      {/* Admin Login Modal */}
      <AdminLogin 
        isOpen={showAdminLogin} 
        onClose={() => setShowAdminLogin(false)} 
        setIsAdmin={setIsAdmin} 
      />

      {/* Main Page Layout (visible only after loader finishes or loaded progressively) */}
      {!isLoading && (
        <div className="flex flex-col min-h-screen">
          <Navbar />
          
          <main className="flex-grow">
            <Hero />
            
            <div id="philosophy">
              <Philosophy />
            </div>
            
            <div id="about">
              <About />
            </div>
            
            <div id="gallery">
              <Gallery 
                isAdmin={isAdmin} 
                onAdminClick={() => setShowAdminLogin(true)} 
                onLockPortal={() => setIsAdmin(false)} 
              />
            </div>
            
            <div id="services">
              <Services />
            </div>
            
            <div id="journey">
              <Timeline />
            </div>
            
            <div id="stylists">
              <Stylists />
            </div>
            
            <div id="testimonials">
              <Testimonials />
            </div>
            
            <div id="schedule">
              <WeeklySchedule />
            </div>
            
            <div id="contact">
              <Contact />
            </div>
          </main>
          
          <Footer onAdminClick={() => setShowAdminLogin(true)} isAdmin={isAdmin} />
        </div>
      )}
    </div>
  );
}
