import { createContext, useContext, useEffect, useState } from "react";
import { getMenu } from "../services/menu.service";
import type { IMenuItem } from "../types/menu";

interface StoreContextType {
  menus: IMenuItem[];
  setMenus: React.Dispatch<React.SetStateAction<IMenuItem[]>>;
  loading: boolean;
  updateLoader: (value: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menus, setMenus] = useState<IMenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const updateLoader = (value: boolean) => setLoading(value);

  useEffect(() => {
    getMenu()
      .then((res) => setMenus(res?.data || []))
      .catch((err) => {
        console.error("Failed to fetch menu:", err);
        setMenus([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <StoreContext.Provider value={{ menus, setMenus, loading, updateLoader }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStoreContext must be used within a StoreProvider");
  return context;
};