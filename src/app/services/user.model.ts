export interface User {
    id: number;
    name: string;
    username: string;
    password?: string;
    skillSet?: string;
    reportingMgr?: number;
    role: string;
    email?: string;
    phoneNumber?: string;
    department: string;
} 