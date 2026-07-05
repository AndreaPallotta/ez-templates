/* eslint-disable no-unused-vars */
export abstract class SessionStore {
    abstract getSession(id: string): any;
    abstract setSession(id: string, session: any): void;
    abstract getAllSessions(): any[];
    abstract connect(id: string, session: any): void;
    abstract disconnect(id: string): void;
}
