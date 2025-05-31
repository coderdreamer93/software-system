// src/auth.js
export const fakeAuth = {
    isAuthenticated: false,
    login(cb) {
      this.isAuthenticated = true;
      setTimeout(cb, 100);
    },
    logout(cb) {
      this.isAuthenticated = false;
      setTimeout(cb, 100);
    }
  };
  