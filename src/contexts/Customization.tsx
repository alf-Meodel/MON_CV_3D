import { createContext, useState, useContext, ReactNode } from 'react';

// Typage du contexte
interface CustomizationContextType {
  material: string;
  setMaterial: (material: string) => void;
  legs: number;
  setLegs: (legs: number) => void;
}

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

// Typage des props
interface CustomizationProviderProps {
  children: ReactNode;
}

export const CustomizationProvider = ({ children }: CustomizationProviderProps) => {
  const [material, setMaterial] = useState<string>("leather");
  const [legs, setLegs] = useState<number>(1);


  return (
    <CustomizationContext.Provider
      value={{
        material,
        setMaterial,
        legs,
        setLegs,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useCustomization = (): CustomizationContextType => {
  const context = useContext(CustomizationContext);
  if (context === undefined) {
    throw new Error("useCustomization must be used within a CustomizationProvider");
  }
  return context;
};
