import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import PetView from './components/PetView';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public route for pet view */}
        <Route path="/pet/:id" element={<PetView />} />
        
        {/* Protected routes */}
        <Route
          path="/*"
          element={
            user ? (
              <Dashboard />
            ) : (
              <AuthForm onAuthSuccess={() => window.location.reload()} />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;