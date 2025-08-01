import { KosovoCity } from "@/types/nejat";
import { createContext, ReactNode, use, useState } from "react";

interface CityDateInterface {
    dateRange: {start?: Date | null, end?: Date | null}
    city: KosovoCity | "ALL"
    setCity: (city: KosovoCity | "ALL") => void;
    setDateRange: React.Dispatch<React.SetStateAction<{start?: Date | null; end?: Date | null}>>;
    resetFilters: () => void;
}

const CityDateContext = createContext<CityDateInterface | undefined>(undefined)

export const useCityDate = () => {
    const context = use(CityDateContext)
    if(!context){
        throw new Error("useCityDate must be within a CityDateProvider")
    }
    return context;
}

export const CityDateProvider = ({children}: {children :ReactNode}) => {
    const [city, setCity] = useState<KosovoCity | "ALL">("ALL")
    const [dateRange, setDateRange] = useState<{start?: Date | null; end?: Date | null}>({
        start: null,
        end: null
    })

    const resetFilters = () => {
        setCity("ALL")
        setDateRange({start: null, end: null})
    }

    return (
        <CityDateContext value={{city, dateRange, setCity, setDateRange, resetFilters}}>
            {children}
        </CityDateContext>
    )
}