import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { connectSocket, disconnectSocket } from "../services/socketService.js";
import { selectIsAuthenticated } from "../store/authSlice.js";

const SocketContext = createContext(null);

// Mounted by AppLayout — connects once the user is authenticated, tears the
// connection down on logout. useSocket() layers event subscriptions on top.
export const SocketProvider = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      setSocket(null);
      return undefined;
    }
    setSocket(connectSocket());
    return () => disconnectSocket();
  }, [isAuthenticated]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocketContext = () => useContext(SocketContext);
