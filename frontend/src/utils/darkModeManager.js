// utils/darkModeManager.js
class DarkModeManager {
  constructor() {
    this.listeners = new Set();
    this.initialize();
  }

  initialize() {
    // Cek dari localStorage atau default ke false
    const saved = localStorage.getItem('smartspend-darkmode');
    this.isDarkMode = saved !== null ? JSON.parse(saved) : false;
    
    // Terapkan ke HTML
    this.applyToDOM();
  }

  getDarkMode() {
    return this.isDarkMode;
  }

  setDarkMode(value) {
    this.isDarkMode = value;
    localStorage.setItem('smartspend-darkmode', JSON.stringify(value));
    this.applyToDOM();
    this.notifyListeners();
  }

  toggleDarkMode() {
    this.setDarkMode(!this.isDarkMode);
  }

  applyToDOM() {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    // Return unsubscribe function
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.isDarkMode));
  }
}

// Buat singleton instance
export const darkModeManager = new DarkModeManager();