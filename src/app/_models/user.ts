export class User {
    id: string;
    email: string;
    access_token: string;
    token_type?: string;
    expires_at: string;
    password?: string;
    remember_me?: boolean;
}
