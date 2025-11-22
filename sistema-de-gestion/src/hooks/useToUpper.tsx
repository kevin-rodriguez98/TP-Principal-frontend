import { useCallback } from "react";

export const useToUpper = () => {
    const toUpperObject = useCallback(<T extends object>(obj: T): T => {
        const result: any = {};
        for (const key in obj) {
            const value = (obj as any)[key];
            result[key] =
                typeof value === "string" ? value.toUpperCase().trim() : value;
        }
        return result as T;
    }, []);

    return { toUpperObject };
};
