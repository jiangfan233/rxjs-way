import React from "react"

interface ClientOnlyProps {
    children: React.ReactNode;
}

export const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
    return <>
        {children ? children : null}
    </>
}