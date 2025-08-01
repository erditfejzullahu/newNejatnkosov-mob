import { createContext, ReactNode, use, useState } from "react";

interface BottomShelfContextType {
    isOpen: boolean;
    toggle: () => void;
}

const BottomShelfContext = createContext<BottomShelfContextType | undefined>(undefined);

export const useBottomShelf = () => {
    const context = use(BottomShelfContext)
    if(!context){
        throw new Error("useBottomShelf must be used within a BottomShelfProvider");
    }
    return context;
}

export const BottomShelfProvider = ({children}: {children: ReactNode}) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggle = () => setIsOpen(!isOpen);

    return (
        <BottomShelfContext value={{isOpen, toggle}}>
            {children}
        </BottomShelfContext>
    )
}