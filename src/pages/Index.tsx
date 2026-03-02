
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { tryAutoScroll } from '@/lib/scroll';
import Hero from '../components/Hero';
import DiveSites from '../components/DiveSites';
import Courses from '../components/Courses';
import Gallery from '../components/Gallery';
import About from '../components/About';
import Contact from '../components/Contact';
import FunDivingSection from '../components/FunDivingSection';

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    const fromStorage = sessionStorage.getItem('scrollTo');
    const hashAnchor = location.hash ? location.hash.replace('#', '') : null;
    const anchor = fromStorage || hashAnchor;
    if (anchor) {
      tryAutoScroll(anchor);
      try { sessionStorage.removeItem('scrollTo'); } catch (_) {}
    }
  }, [location]);
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <About />
      <DiveSites />
      <Courses />
      <FunDivingSection />
      <Gallery />
      <Contact />
    </div>
  );
};

export default Index;
