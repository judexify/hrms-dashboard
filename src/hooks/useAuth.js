import { useContext } from "react";
import { AuthContext } from "../Auth/AuthContext";

const useAuth = () => useContext(AuthContext);

export default useAuth;
