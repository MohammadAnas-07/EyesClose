import '@testing-library/jest-dom/vitest';

// jsdom has no scrolling. The form scrolls to the top on each new screen.
window.scrollTo = () => {};
