import type {User} from "../schemas/LoginSchema";

const USER_STORAGE_KEY = 'currentUser';
const TOKEN_KEY = 'authToken';

export class AuthStore {
 static setUser(user: User): void {
    sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }

  static getUser(): User | null {
    const userData = sessionStorage.getItem(USER_STORAGE_KEY);
    if (!userData) return null;
    
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }

  static clearUser(): void {
    sessionStorage.removeItem(USER_STORAGE_KEY);
  }

  static getUserRole(): string | null {
    const user = this.getUser();
    return user?.rol || null;
  }

  static isAuthenticated(): boolean {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = this.getUser();
    return !!token && !!user;
  }
  
  static clearAll(): void {
   
    sessionStorage.clear();
    
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('admin_auth_token');
    localStorage.removeItem('userSession');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
  }
}