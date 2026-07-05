import { SessionStore } from './SessionStore.js';

export class MemorySession extends SessionStore {
    private sessions: Map<string, any>;

    constructor() {
        super();
        this.sessions = new Map();
    }

    getSession(id: string) {
        return this.sessions.get(id);
    }

    setSession(id: string, session: any) {
        this.sessions.set(id, session);
    }

    getAllSessions() {
        return Array.from(this.sessions.values());
    }

    connect(id: string, session: any) {
        this.setSession(id, {
            ...session,
            connected: true,
        });
    }

    disconnect(id: string) {
        const session = this.getSession(id);
        if (session) {
            this.setSession(id, {
                ...session,
                connected: false,
            });
        }
    }
}
