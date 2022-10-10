import React, { createContext, useContext, useState } from 'react';

const CommonContext = createContext(null);

export function CommonProvider({ children }) {
    const [common, setCommon] = useState({
        errorMessages: '',
        isOpen: false
    });

    const value = { common, setCommon };

    return (
        <CommonContext.Provider value={value}>
            {children}
        </CommonContext.Provider>
    )
}

export function useCommon() {
    return useContext(CommonContext);
}