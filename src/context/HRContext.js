import { useContext, createContext } from "react";

export const HRContext = createContext();
export const useEmployee = () => useContext(HRContext);
export const useAttendance = () => useContext(HRContext);
export const useCandidates = () => useContext(HRContext);
