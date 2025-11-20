/**
 * Accessibility utilities for MR.CREAMS application
 * Implements WCAG 2.1 AA compliance helpers
 */

// Focus trap for modal dialogs
export const createFocusTrap = (containerRef) => {
  const focusableElements = containerRef.current?.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (!focusableElements || focusableElements.length === 0) return;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  // Set initial focus
  firstElement.focus();
  
  return (e) => {
    if (e.key === 'Tab') {
      // Shift + Tab
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
      // Tab
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
    
    // Close on Escape
    if (e.key === 'Escape') {
      e.preventDefault();
      // Caller should provide close function
    }
  };
};

// Skip to content link handler
export const setupSkipToContent = () => {
  const skipLink = document.getElementById('skip-to-content');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.setAttribute('tabindex', '-1');
        mainContent.focus();
      }
    });
  }
};

// Announce messages to screen readers
export const announceToScreenReader = (message) => {
  const announcer = document.getElementById('sr-announcer');
  if (!announcer) {
    const newAnnouncer = document.createElement('div');
    newAnnouncer.id = 'sr-announcer';
    newAnnouncer.setAttribute('aria-live', 'polite');
    newAnnouncer.setAttribute('aria-atomic', 'true');
    newAnnouncer.classList.add('sr-only');
    document.body.appendChild(newAnnouncer);
    
    // Set message after a small delay to ensure screen readers catch it
    setTimeout(() => {
      newAnnouncer.textContent = message;
    }, 100);
  } else {
    announcer.textContent = '';
    
    // Set message after a small delay to ensure screen readers catch it
    setTimeout(() => {
      announcer.textContent = message;
    }, 100);
  }
};

// Add CSS for screen reader only elements
export const injectScreenReaderCSS = () => {
  if (!document.getElementById('sr-styles')) {
    const style = document.createElement('style');
    style.id = 'sr-styles';
    style.textContent = `
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
      }
      
      .skip-to-content {
        position: absolute;
        top: -40px;
        left: 0;
        background: #007bff;
        color: white;
        padding: 8px;
        z-index: 100;
        transition: top 0.3s;
      }
      
      .skip-to-content:focus {
        top: 0;
      }
    `;
    document.head.appendChild(style);
  }
};

// Check contrast ratio
export const checkContrastRatio = (foreground, background) => {
  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };
  
  // Calculate relative luminance
  const luminance = (r, g, b) => {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };
  
  const rgb1 = hexToRgb(foreground);
  const rgb2 = hexToRgb(background);
  
  if (!rgb1 || !rgb2) return null;
  
  const l1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = luminance(rgb2.r, rgb2.g, rgb2.b);
  
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  
  return {
    ratio: ratio.toFixed(2),
    passes: {
      AA: {
        normal: ratio >= 4.5,
        large: ratio >= 3
      },
      AAA: {
        normal: ratio >= 7,
        large: ratio >= 4.5
      }
    }
  };
};

// Initialize all accessibility features
export const initAccessibility = () => {
  injectScreenReaderCSS();
  setupSkipToContent();
  
  // Add skip link if it doesn't exist
  if (!document.getElementById('skip-to-content')) {
    const skipLink = document.createElement('a');
    skipLink.id = 'skip-to-content';
    skipLink.href = '#main-content';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = 'Skip to content';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
};