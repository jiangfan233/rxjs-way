import React from "react"

interface ClientOnlyProps {
    children: React.ReactNode;
}

// warnning：shadow compare
const ClientOnly: React.FC<ClientOnlyProps> = React.memo(({ children }) => {
    return <>
        {children ? children : null}
    </>
})

ClientOnly.displayName = "ClientOnly";

export default ClientOnly;