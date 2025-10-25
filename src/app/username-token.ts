import { InjectionToken } from "@angular/core";

export const USERNAME_VALIDATOR = new InjectionToken(
  'username-validator',
  {
    providedIn: 'root',
    factory() {
      return async (username: string) => {
        const takenUsernames = ['admin', 'user', 'test'];
        await new Promise((resolve) => setTimeout(resolve, 500));
        return !takenUsernames.includes(username);
      }
    }
  }
);