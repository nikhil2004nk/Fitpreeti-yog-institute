export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

export const navigateTo = (path: string) => {
  if (window.location.hostname.includes('github.io')) {
    window.location.href = `/Fitpreeti-yog-institute/#${path}`;
  } else {
    window.location.hash = path;
  }
  // Scroll to top after a short delay to ensure the page has started loading
  setTimeout(scrollToTop, 100);
};
