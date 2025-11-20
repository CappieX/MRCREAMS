/**
 * Performance monitoring utilities for MR.CREAMS application
 */

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  // Track page load performance metrics
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const domReadyTime = perfData.domComplete - perfData.domLoading;
      
      // Log performance metrics
      console.info('Performance metrics:', {
        pageLoadTime: `${pageLoadTime}ms`,
        domReadyTime: `${domReadyTime}ms`,
        networkLatency: `${perfData.responseEnd - perfData.requestStart}ms`,
        serverResponseTime: `${perfData.responseEnd - perfData.responseStart}ms`,
        redirectTime: `${perfData.redirectEnd - perfData.redirectStart}ms`,
        domInteractive: `${perfData.domInteractive - perfData.navigationStart}ms`,
        domContentLoaded: `${perfData.domContentLoadedEventEnd - perfData.navigationStart}ms`
      });
      
      // Send metrics to backend for analytics
      sendPerformanceMetrics({
        pageLoadTime,
        domReadyTime,
        networkLatency: perfData.responseEnd - perfData.requestStart,
        serverResponseTime: perfData.responseEnd - perfData.responseStart,
        redirectTime: perfData.redirectEnd - perfData.redirectStart,
        domInteractive: perfData.domInteractive - perfData.navigationStart,
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.navigationStart,
        url: window.location.pathname
      });
    }, 0);
  });
  
  // Track resource loading performance
  observeResourceTiming();
  
  // Track long tasks
  observeLongTasks();
};

// Send performance metrics to backend
const sendPerformanceMetrics = (metrics) => {
  // Use navigator.sendBeacon for non-blocking metrics sending
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(metrics)], { type: 'application/json' });
    navigator.sendBeacon('/api/performance-metrics', blob);
  } else {
    // Fallback to fetch API
    fetch('/api/performance-metrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(metrics),
      // Use keepalive to ensure the request completes even if page unloads
      keepalive: true
    }).catch(err => console.error('Error sending performance metrics:', err));
  }
};

// Observe resource timing
const observeResourceTiming = () => {
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    
    // Filter for slow resources (e.g., taking more than 1000ms)
    const slowResources = entries.filter(entry => entry.duration > 1000);
    
    if (slowResources.length > 0) {
      console.warn('Slow resources detected:', slowResources);
      
      // Send slow resource data to backend
      sendPerformanceMetrics({
        type: 'slow-resources',
        resources: slowResources.map(res => ({
          name: res.name,
          duration: res.duration,
          initiatorType: res.initiatorType,
          size: res.transferSize
        }))
      });
    }
  });
  
  // Observe resource timing entries
  observer.observe({ entryTypes: ['resource'] });
};

// Observe long tasks
const observeLongTasks = () => {
  // Check if Long Tasks API is supported
  if (typeof PerformanceObserver !== 'undefined' && PerformanceObserver.supportedEntryTypes && PerformanceObserver.supportedEntryTypes.includes('longtask')) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach(entry => {
        console.warn(`Long task detected: ${entry.duration}ms`, entry);
        
        // Send long task data to backend
        sendPerformanceMetrics({
          type: 'long-task',
          duration: entry.duration,
          startTime: entry.startTime,
          url: window.location.pathname
        });
      });
    });
    
    // Observe long task entries
    observer.observe({ entryTypes: ['longtask'] });
  }
};

// Track first contentful paint
export const trackFCP = () => {
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach(entry => {
      console.info(`First Contentful Paint: ${entry.startTime}ms`);
      sendPerformanceMetrics({
        type: 'fcp',
        value: entry.startTime,
        url: window.location.pathname
      });
    });
    observer.disconnect();
  });
  
  observer.observe({ type: 'paint', buffered: true });
};

// Track largest contentful paint
export const trackLCP = () => {
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    
    console.info(`Largest Contentful Paint: ${lastEntry.startTime}ms`);
    sendPerformanceMetrics({
      type: 'lcp',
      value: lastEntry.startTime,
      url: window.location.pathname
    });
  });
  
  observer.observe({ type: 'largest-contentful-paint', buffered: true });
};

// Track cumulative layout shift
export const trackCLS = () => {
  let clsValue = 0;
  let clsEntries = [];
  
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    
    entries.forEach(entry => {
      // Only count layout shifts without recent user input
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        clsEntries.push(entry);
      }
    });
    
    console.info(`Cumulative Layout Shift: ${clsValue}`);
    sendPerformanceMetrics({
      type: 'cls',
      value: clsValue,
      url: window.location.pathname
    });
  });
  
  observer.observe({ type: 'layout-shift', buffered: true });
};

// Initialize all performance tracking
export const initPerformanceTracking = () => {
  initPerformanceMonitoring();
  trackFCP();
  trackLCP();
  trackCLS();
};