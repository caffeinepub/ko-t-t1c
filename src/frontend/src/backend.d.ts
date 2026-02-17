import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Submission {
    timestamp: Time;
    variations: Array<string>;
    photoA?: string;
    photoB?: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addOlderSubmission(originalText: string, variations: Array<string>): Promise<void>;
    addSubmission(photoA: string, photoB: string, variations: Array<string>): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearHistory(): Promise<void>;
    getAllUsersWithHistory(): Promise<Array<Principal>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getHistory(): Promise<Array<Submission>>;
    getSubmissionByTimestamp(timestamp: bigint): Promise<Submission>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
