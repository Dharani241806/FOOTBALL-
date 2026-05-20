/**
 * MASTER SPA ROUTER & VIEW CONTROLLER (app.js)
 * Manages client-side routing, URL query parsing, active tab states, global modals, and toast elements.
 */

window.App = {
  init() {
    // Listen to hash changes
    window.addEventListener('hashchange', () => this.loadView());
    
    // Listen to ESC key to close modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });

    // Default route
    if (!window.location.hash) {
      window.location.hash = '#dashboard';
    } else {
      this.loadView();
    }
  },

  // Helper to parse current query params from hash: #reports?playerId=p1 -> { playerId: 'p1' }
  getQueryParams() {
    const hash = window.location.hash;
    const params = {};
    if (hash.includes('?')) {
      const queryStr = hash.split('?')[1];
      const pairs = queryStr.split('&');
      pairs.forEach(pair => {
        const [key, val] = pair.split('=');
        if (key && val) {
          params[key] = decodeURIComponent(val);
        }
      });
    }
    return params;
  },

  // Dynamic Page Router
  loadView() {
    const hash = window.location.hash;
    const baseRoute = hash.includes('?') ? hash.split('?')[0] : hash;
    const params = this.getQueryParams();
    const container = document.getElementById('view-container');
    
    if (!container) return;

    // Reset container with beautiful smooth page fade transitions
    container.style.opacity = '0';
    container.style.transform = 'translateY(10px)';

    setTimeout(() => {
      let pageHtml = '';
      let initCallback = null;

      // Set sidebar active state highlights
      this.highlightNavLinks(baseRoute);

      switch (baseRoute) {
        case '#dashboard':
          pageHtml = window.DashboardComponent.render();
          initCallback = () => window.DashboardComponent.init();
          break;
        case '#squad':
          pageHtml = window.SquadComponent.render();
          initCallback = () => window.SquadComponent.init();
          break;
        case '#sessions':
          pageHtml = window.SessionsComponent.render();
          initCallback = () => window.SessionsComponent.init();
          break;
        case '#reports':
          pageHtml = window.ReportsComponent.render(params);
          initCallback = () => window.ReportsComponent.init(params);
          break;
        case '#drills':
          pageHtml = window.DrillsComponent.render();
          initCallback = () => window.DrillsComponent.init();
          break;
        default:
          pageHtml = `<div class="card"><h2>404 - View Not Found</h2><p>Page route ${baseRoute} does not exist.</p></div>`;
      }

      container.innerHTML = pageHtml;
      
      // Execute components JS integrations (like ChartJS, Filters, etc.)
      if (initCallback) initCallback();

      // Trigger standard transition fade in
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
    }, 150);
  },

  // Toggle active highlights on desktop sidebars and mobile bottom menubars
  highlightNavLinks(activeRoute) {
    const routes = ['dashboard', 'squad', 'sessions', 'drills'];
    
    routes.forEach(r => {
      const activeState = activeRoute === `#${r}`;
      
      // Desktop
      const desktopEl = document.getElementById(`nav-${r}`);
      if (desktopEl) {
        desktopEl.classList.toggle('active', activeState);
      }
      
      // Mobile
      const mobileEl = document.getElementById(`m-nav-${r}`);
      if (mobileEl) {
        mobileEl.classList.toggle('active', activeState);
      }
    });

    // Special case for reports which shares sidebar space or acts as child
    if (activeRoute === '#reports') {
      // Highlight squad nav links as parent context
      const squadD = document.getElementById('nav-squad');
      const squadM = document.getElementById('m-nav-squad');
      if (squadD) squadD.classList.add('active');
      if (squadM) squadM.classList.add('active');
    }
  },

  // --- MODAL COMPONENT CONTROLLER ---
  openModal(title, contentHtml) {
    const overlay = document.getElementById('modal-overlay');
    const container = document.getElementById('modal-container');
    
    if (overlay && container) {
      container.innerHTML = `
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button class="modal-close" onclick="window.App.closeModal()">&times;</button>
        </div>
        <div class="modal-body">
          ${contentHtml}
        </div>
      `;
      overlay.classList.add('active');
    }
  },

  closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
  },

  // --- GLOWING TOAST ALERTS SYSTEM ---
  toast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
    
    const icon = type === 'success' 
      ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" style="width: 20px; height: 20px; stroke: var(--accent-green);"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" style="width: 20px; height: 20px; stroke: var(--color-injured);"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`;

    toast.innerHTML = `
      ${icon}
      <span>${message}</span>
    `;

    container.appendChild(toast);

    // Fade and slide out after 3.5 seconds
    setTimeout(() => {
      toast.style.transform = 'translateX(120%)';
      toast.style.opacity = '0';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};

// Initialize Application once DOM fully loads
document.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});
