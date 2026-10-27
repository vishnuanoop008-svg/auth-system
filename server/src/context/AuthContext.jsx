import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  registerUser,
  getUserById,
  checkUsername as checkUsernameApi,
  checkEmail,
} from "../services/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchCurrentUser() {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setUser(null);
      setIsLoading(false);
      return null;
    }

    try {
      const currentUser = await getUserById(userId);
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      localStorage.removeItem("userId");
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  async function login(credentials) {
    const users = await loginUser(credentials.email.trim());
    const foundUser = users.find(
      (item) => item.password === credentials.password
    );

    if (!foundUser) {
      throw new Error("Invalid email or password");
    }

    localStorage.setItem("userId", String(foundUser.id));
    setUser(foundUser);

    return foundUser;
  }

  async function register(userData) {
    const usernameTaken = await checkUsernameApi(
      userData.username.trim()
    );

    if (usernameTaken) {
      throw new Error("Username is already taken");
    }

    const emailTaken = await checkEmail(userData.email.trim());

    if (emailTaken) {
      throw new Error("Email is already registered");
    }

    const newUser = await registerUser({
      username: userData.username.trim(),
      email: userData.email.trim(),
      password: userData.password,
      fullName: userData.fullName.trim(),
      avatar: "",
      createdAt: new Date().toISOString(),
    });

    return newUser;
  }

  function logout() {
    localStorage.removeItem("userId");
    setUser(null);
  }

  function isAuthenticated() {
    return Boolean(user);
  }

  async function checkUsername(username) {
    return checkUsernameApi(username.trim());
  }

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated,
    fetchCurrentUser,
    checkUsername,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;