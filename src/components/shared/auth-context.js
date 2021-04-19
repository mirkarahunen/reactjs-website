import { createContext } from 'react';

// Create app wide log-in authorization context for state management
const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  username: null,
  token: null,
  login: () => {},
  logout: () => {}
});
export default AuthContext