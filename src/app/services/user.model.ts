export interface User {
    name: string;
    username: string;
    password: string;
    role: string;
    reportsTo?: string;
    customRole?: string;
} 