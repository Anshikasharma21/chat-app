import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import io from "socket.io-client";
import { AuthContext } from "./AuthContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl;

const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    } else {
      delete axios.defaults.headers.common["token"];
    }
  }, [token]);

  const connectSocket = (userData) => {
    if (!userData) return;
    if (socketRef.current && socketRef.current.connected) return;

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });

    newSocket.connect();
    socketRef.current = newSocket;

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  const getSocket = () => socketRef.current;

  useEffect(() => {
    const fetchAuthUser = async () => {
      try {
        const { data } = await axios.get("/api/auth/check");
        if (data.success) {
          setAuthUser(data.user);
          connectSocket(data.user);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchAuthUser();
  }, []);

  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.userData);
        setToken(data.token);
        localStorage.setItem("token", data.token);
        connectSocket(data.userData);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    if (socketRef.current) socketRef.current.disconnect();
    toast.success("Logged out successfully");
  };

  // FIX: updateProfile now returns a Promise so ProfilePage can await it
  // and toast runs INSIDE here — guaranteed to fire before navigate()
  const updateProfile = async (body) => {
    try {
      // Show loading toast while request is in flight
      const loadingToast = toast.loading("Updating profile...");

      const { data } = await axios.put("/api/auth/update-profile", body);

      // Dismiss loading toast first
      toast.dismiss(loadingToast);

      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      } else {
        // Server returned success:false
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    axios,
    token,
    authUser,
    setAuthUser,
    onlineUsers,
    login,
    logout,
    updateProfile,
    connectSocket,
    getSocket,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;