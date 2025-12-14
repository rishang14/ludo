import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    baseURL: "http://localhost:8000" ,// The base URL of your auth server 
    
})   
export const  {useSession} = createAuthClient();