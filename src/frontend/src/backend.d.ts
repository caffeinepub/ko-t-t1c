import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Submission {
    originalText: string;
    timestamp: Time;
    variations: Array<string>;
}
export type Time = bigint;
export interface backendInterface {
    addSubmission(originalText: string, variations: Array<string>): Promise<void>;
    clearHistory(): Promise<void>;
    getAllUsersWithHistory(): Promise<Array<Principal>>;
    getHistory(): Promise<Array<Submission>>;
    getSubmissionByTimestamp(timestamp: bigint): Promise<Submission>;
}
