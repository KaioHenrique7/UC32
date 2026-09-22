export interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
}

export interface Complaint {
    id?: number;
    user_id: number;
    title: string;
    description: string;
    status?: "aberta" | "em_analise" | "resolvida";
    created_at?: Date;
}
