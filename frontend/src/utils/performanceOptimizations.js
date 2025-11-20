/**
 * Performance optimization utilities for MR.CREAMS application
 */

import { useCallback, useEffect, useRef } from 'react';

/**
 * Custom hook for debouncing function calls
 * @param {Function} fn - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export const useDebounce = (fn, delay) => {
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      fn(...args);
    }, delay);
  }, [fn, delay]);
};

/**
 * Custom hook for throttling function calls
 * @param {Function} fn - The function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} - Throttled function
 */
export const useThrottle = (fn, limit) => {
  const lastRun = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback((...args) => {
    const now = Date.now();
    if (now - lastRun.current >= limit) {
      fn(...args);
      lastRun.current = now;
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        fn(...args);
        lastRun.current = Date.now();
      }, limit - (now - lastRun.current));
    }
  }, [fn, limit]);
};

/**
 * Custom hook for lazy loading images
 * @param {string} src - Image source URL
 * @param {string} placeholder - Placeholder image URL
 * @returns {string} - Image source to use
 */
export const useLazyImage = (src, placeholder) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const observerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observerRef.current.disconnect();
        }
      });
    });

    if (imageRef.current) {
      observerRef.current.observe(imageRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src]);

  return [imageSrc, imageRef];
};

/**
 * Utility to detect if the browser supports the IntersectionObserver API
 * @returns {boolean} - Whether IntersectionObserver is supported
 */
export const supportsIntersectionObserver = () => {
  return 'IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype;
};

/**
 * Utility to detect if the browser supports the WebP image format
 * @returns {Promise<boolean>} - Whether WebP is supported
 */
export const supportsWebP = async () => {
  if (!self.createImageBitmap) return false;
  
  const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  const blob = await fetch(webpData).then(r => r.blob());
  
  return createImageBitmap(blob).then(() => true, () => false);
};

/**
 * Utility to detect if the device is a mobile device
 * @returns {boolean} - Whether the device is mobile
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Utility to detect if the device has a slow connection
 * @returns {boolean} - Whether the connection is slow
 */
export const hasSlowConnection = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection) {
    return connection.downlink < 1.5 || connection.rtt > 500 || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
  }
  return false;
};

/**
 * Import a component dynamically with React.lazy
 * @param {Function} importFunc - Import function
 * @returns {React.LazyExoticComponent} - Lazy loaded component
 */
export const lazyWithPreload = (importFunc) => {
  const Component = React.lazy(importFunc);
  Component.preload = importFunc;
  return Component;
};