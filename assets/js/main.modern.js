/**
 * Modern JavaScript for Ivan Li's Website
 * Vanilla JS - No jQuery dependency
 * Optimized for performance and mobile
 */

(function() {
  'use strict';

  // ==========================================================================
  // Utility Functions
  // ==========================================================================
  
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  
  // Debounce function for scroll events
  function debounce(func, wait = 10) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // ==========================================================================
  // Navigation
  // ==========================================================================
  
  class Navigation {
    constructor() {
      this.header = $('#header');
      this.navPanel = $('#navPanel');
      this.navToggle = $('.nav-toggle');
      this.navOverlay = null;
      this.titleBar = $('#titleBar');
      
      if (!this.header) return;
      
      this.init();
    }
    
    init() {
      this.createMobileNav();
      this.bindEvents();
      this.handleScroll();
    }
    
    createMobileNav() {
      // Create overlay for mobile menu
      this.navOverlay = document.createElement('div');
      this.navOverlay.className = 'nav-overlay';
      document.body.appendChild(this.navOverlay);
      
      // Create mobile nav panel if it doesn't exist
      if (!this.navPanel) {
        this.navPanel = document.createElement('nav');
        this.navPanel.id = 'navPanel';
        
        // Clone nav items for mobile
        const navItems = $('#nav ul');
        if (navItems) {
          const mobileNav = this.buildMobileNav(navItems);
          this.navPanel.appendChild(mobileNav);
        }
        
        document.body.appendChild(this.navPanel);
      }
      
      // Create title bar for mobile if it doesn't exist
      if (!this.titleBar) {
        this.titleBar = document.createElement('div');
        this.titleBar.id = 'titleBar';
        this.titleBar.innerHTML = `
          <button class="toggle" aria-label="Toggle menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <span class="title"><a href="/">Ivan Li</a></span>
        `;
        document.body.prepend(this.titleBar);
        
        // Bind toggle in title bar
        const toggle = this.titleBar.querySelector('.toggle');
        if (toggle) {
          toggle.addEventListener('click', () => this.toggleMobileNav());
        }
      }
    }
    
    buildMobileNav(navList, depth = 0) {
      const ul = document.createElement('ul');
      
      $$(':scope > li', navList).forEach(item => {
        const link = $('a', item);
        const subMenu = $(':scope > ul', item);
        
        if (link) {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = link.href;
          a.className = `link depth-${depth}`;
          
          // Add indent spans
          for (let i = 0; i < depth; i++) {
            const indent = document.createElement('span');
            indent.className = `indent-${i + 1}`;
            a.appendChild(indent);
          }
          
          a.appendChild(document.createTextNode(link.textContent));
          li.appendChild(a);
          ul.appendChild(li);
          
          // Recursively build submenus
          if (subMenu) {
            const subItems = this.buildMobileNav(subMenu, depth + 1);
            ul.appendChild(subItems);
          }
        }
      });
      
      return ul;
    }
    
    bindEvents() {
      // Toggle button
      if (this.navToggle) {
        this.navToggle.addEventListener('click', () => this.toggleMobileNav());
      }
      
      // Overlay click closes menu
      if (this.navOverlay) {
        this.navOverlay.addEventListener('click', () => this.closeMobileNav());
      }
      
      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.closeMobileNav();
      });
      
      // Header scroll effect
      window.addEventListener('scroll', debounce(() => this.handleScroll(), 10));
      
      // Close mobile nav on resize to desktop
      window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 980) {
          this.closeMobileNav();
        }
      }, 100));
    }
    
    toggleMobileNav() {
      const isVisible = this.navPanel?.classList.contains('is-visible');
      if (isVisible) {
        this.closeMobileNav();
      } else {
        this.openMobileNav();
      }
    }
    
    openMobileNav() {
      this.navPanel?.classList.add('is-visible');
      this.navOverlay?.classList.add('is-visible');
      document.body.classList.add('navPanel-visible');
      
      // Update ARIA
      this.navToggle?.setAttribute('aria-expanded', 'true');
    }
    
    closeMobileNav() {
      this.navPanel?.classList.remove('is-visible');
      this.navOverlay?.classList.remove('is-visible');
      document.body.classList.remove('navPanel-visible');
      
      // Update ARIA
      this.navToggle?.setAttribute('aria-expanded', 'false');
    }
    
    handleScroll() {
      if (!this.header) return;
      
      const scrollY = window.scrollY || window.pageYOffset;
      
      if (scrollY > 50) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }
    }
  }

  // ==========================================================================
  // Smooth Scrolling
  // ==========================================================================
  
  class SmoothScroll {
    constructor() {
      this.init();
    }
    
    init() {
      // Handle anchor links
      $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          if (href === '#' || href === '#!') return;
          
          const target = $(href);
          if (target) {
            e.preventDefault();
            this.scrollTo(target);
          }
        });
      });
    }
    
    scrollTo(element, offset = 80) {
      const targetPosition = element.getBoundingClientRect().top + window.scrollY - offset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  // ==========================================================================
  // Lazy Loading Images
  // ==========================================================================
  
  class LazyLoad {
    constructor() {
      this.images = $$('img[data-src], img[loading="lazy"]');
      
      if ('IntersectionObserver' in window) {
        this.initObserver();
      } else {
        this.loadAllImages();
      }
    }
    
    initObserver() {
      const options = {
        root: null,
        rootMargin: '50px 0px',
        threshold: 0.01
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, options);
      
      this.images.forEach(img => observer.observe(img));
    }
    
    loadImage(img) {
      const src = img.dataset.src || img.src;
      if (src) {
        img.src = src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
      }
    }
    
    loadAllImages() {
      this.images.forEach(img => this.loadImage(img));
    }
  }

  // ==========================================================================
  // Popups / Modals
  // ==========================================================================
  
  class Popup {
    constructor() {
      this.popups = $$('.popup-container');
      this.init();
    }
    
    init() {
      // Bind open buttons
      $$('[data-popup]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const popupId = btn.dataset.popup;
          this.open(popupId);
        });
      });
      
      // Bind close buttons
      $$('.close-button').forEach(btn => {
        btn.addEventListener('click', () => {
          const popup = btn.closest('.popup-container');
          if (popup) this.close(popup.id);
        });
      });
      
      // Close on overlay click
      this.popups.forEach(popup => {
        popup.addEventListener('click', (e) => {
          if (e.target === popup) {
            this.close(popup.id);
          }
        });
      });
      
      // Close on escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.popups.forEach(popup => {
            if (popup.style.display === 'block' || popup.classList.contains('is-visible')) {
              this.close(popup.id);
            }
          });
        }
      });
    }
    
    open(id) {
      const popup = $(`#${id}`);
      if (popup) {
        popup.style.display = 'block';
        popup.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
      }
    }
    
    close(id) {
      const popup = $(`#${id}`);
      if (popup) {
        popup.style.display = 'none';
        popup.classList.remove('is-visible');
        document.body.style.overflow = '';
      }
    }
  }
  
  // Make popup functions globally available for inline onclick handlers
  window.openPopup = function(event, containerId) {
    event.preventDefault();
    const popup = document.getElementById(containerId);
    if (popup) {
      popup.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
  };
  
  window.closePopup = function(containerId) {
    const popup = document.getElementById(containerId);
    if (popup) {
      popup.style.display = 'none';
      document.body.style.overflow = '';
    }
  };

  // ==========================================================================
  // Scroll Animations (replaces scrollex)
  // ==========================================================================
  
  class ScrollAnimations {
    constructor() {
      this.elements = $$('[data-animate]');
      
      if ('IntersectionObserver' in window && this.elements.length > 0) {
        this.initObserver();
      }
    }
    
    initObserver() {
      const options = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, options);
      
      this.elements.forEach(el => observer.observe(el));
    }
  }

  // ==========================================================================
  // Preload Handler
  // ==========================================================================
  
  class PreloadHandler {
    constructor() {
      this.body = document.body;
      this.init();
    }
    
    init() {
      // Remove preload class after page load
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.body.classList.remove('is-preload');
        }, 100);
      });
    }
  }

  // ==========================================================================
  // Initialize Everything
  // ==========================================================================
  
  function init() {
    new PreloadHandler();
    new Navigation();
    new SmoothScroll();
    new LazyLoad();
    new Popup();
    new ScrollAnimations();
    
    // Touch detection
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      document.body.classList.add('is-touch');
    }
  }
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();
