import {createContext, useState} from 'react';

export const FileContext = createContext();

export const FileProvider = ({children}) => {
    const [fileDetails, setFileDetails] = useState([]);
    return (
        <FileContext.Provider value={[fileDetails, setFileDetails]}>
            {children}
        </FileContext.Provider>
    )
}