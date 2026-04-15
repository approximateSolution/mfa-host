export interface SharedUser {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar: string;
}
export declare function useSharedState(): {
    selectedUser: SharedUser | null;
    selectUser: (user: SharedUser | null) => void;
};
