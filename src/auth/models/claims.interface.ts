export interface Claims {
    id: string;
    roles: Role[];
}

export enum Role {
    User = 'User',
    Doctor = 'Doctor',
    Administrator = 'Administrator'
}