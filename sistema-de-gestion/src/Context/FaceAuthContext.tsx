import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";


export interface User {
  legajo: string;
  nombre: string;
  event: string;
}

interface FaceAuthContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

const FaceAuthContext = createContext<FaceAuthContextProps | undefined>(undefined);

export const FaceAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <FaceAuthContext.Provider value={{ user, setUser }}>
      {children}
    </FaceAuthContext.Provider>
  );
};

export const useFaceAuth = () => {
  const context = useContext(FaceAuthContext);
  if (!context) throw new Error("useFaceAuth must be used within FaceAuthProvider");
  return context;
};