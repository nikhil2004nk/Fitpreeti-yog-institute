import { useState, useEffect } from 'react';

export const useScrollSpy = (sectionIds: string[]): string => {
  const [activeSection, setActiveSection] = useState(sectionIds[0]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      const selected = sectionIds.find((id) => {
        const el = document.getElementById(id);
        if (el) {
          return (
            el.offsetTop <= scrollPosition &&
            el.offsetTop + el.offsetHeight > scrollPosition
          );
        }
        return false;
      });
      if (selected) setActiveSection(selected);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);

  return activeSection;
};
