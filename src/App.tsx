import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { StepIndicator } from './components/StepIndicator';
import { RegistrationForm } from './components/RegistrationForm';
import { PreviewModal } from './components/PreviewModal';
import { SuccessScreen } from './components/SuccessScreen';
import { AdminDashboard } from './components/AdminDashboard';
import {
  RegistrationFormData,
  RegistrationRecord,
  FormStep,
  PageView,
} from './types/registration';
import {
  getRegistrations,
  saveRegistration,
  deleteRegistration,
  clearAllRegistrations,
  seedSampleData,
} from './services/storage';

export const App: React.FC = () => {
  // Page View routing (register vs admin)
  const [currentView, setCurrentView] = useState<PageView>('register');
  
  // Form step state
  const [formStep, setFormStep] = useState<FormStep>('form');
  
  // Registration Form State (5 slots)
  const [formData, setFormData] = useState<RegistrationFormData>({
    person1: '',
    person2: '',
    person3: '',
    person4: '',
    person5: '',
  });

  // Submitted record for receipt display
  const [lastRecord, setLastRecord] = useState<RegistrationRecord | null>(null);

  // Submitting spinner state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // All registrations from storage
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);

  // Initialize and listen to URL routing
  useEffect(() => {
    // Load existing records from LocalStorage
    const stored = getRegistrations();
    setRegistrations(stored);

    // Check initial URL pathname or hash
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path === '/admin' || hash === '#admin' || hash === '#/admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('register');
    }

    // Listen to popstate (back/forward button)
    const handlePopState = () => {
      const currentPath = window.location.pathname.toLowerCase();
      const currentHash = window.location.hash.toLowerCase();
      if (currentPath === '/admin' || currentHash === '#admin' || currentHash === '#/admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('register');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update browser URL when view changes
  const handleNavigate = (view: PageView) => {
    setCurrentView(view);
    const targetUrl = view === 'admin' ? '/admin' : '/';
    try {
      window.history.pushState({}, '', targetUrl);
    } catch {
      // Fallback for isolated preview environments
      window.location.hash = targetUrl;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Form Step Handlers
  const handleFormSubmit = () => {
    setFormStep('preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToForm = () => {
    setFormStep('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmRegistration = () => {
    setIsSubmitting(true);

    const names = [
      formData.person1,
      formData.person2,
      formData.person3,
      formData.person4,
      formData.person5,
    ];

    setTimeout(() => {
      const newRecord = saveRegistration(names);
      setLastRecord(newRecord);
      setRegistrations(getRegistrations());
      setIsSubmitting(false);
      setFormStep('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };

  const handleResetForm = () => {
    setFormData({
      person1: '',
      person2: '',
      person3: '',
      person4: '',
      person5: '',
    });
    setFormStep('form');
    setLastRecord(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin Handlers
  const handleDeleteRecord = (id: string) => {
    const updated = deleteRegistration(id);
    setRegistrations(updated);
  };

  const handleClearAll = () => {
    clearAllRegistrations();
    setRegistrations([]);
  };

  const handleSeedMockData = () => {
    const seeded = seedSampleData();
    setRegistrations(seeded);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        recordCount={registrations.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {currentView === 'register' ? (
          <div>
            {/* Step Timeline Indicator */}
            <StepIndicator currentStep={formStep} />

            {/* Step 1: Input Form */}
            {formStep === 'form' && (
              <RegistrationForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleFormSubmit}
              />
            )}

            {/* Step 2: Preview & Confirm */}
            {formStep === 'preview' && (
              <PreviewModal
                formData={formData}
                onBack={handleBackToForm}
                onConfirm={handleConfirmRegistration}
                isSubmitting={isSubmitting}
              />
            )}

            {/* Step 3: Success Receipt */}
            {formStep === 'success' && (
              <SuccessScreen
                lastRecord={lastRecord}
                onReset={handleResetForm}
                onGoToAdmin={() => handleNavigate('admin')}
              />
            )}
          </div>
        ) : (
          /* Admin View (/admin) */
          <AdminDashboard
            registrations={registrations}
            onDeleteRecord={handleDeleteRecord}
            onClearAll={handleClearAll}
            onSeedMockData={handleSeedMockData}
            onBackToRegister={() => handleNavigate('register')}
          />
        )}

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default App;
