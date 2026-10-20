import { createContext, useContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { Exam, LocalStudy, User } from './types';
export type SessionValue = { user: User | null; loading: boolean; error: string; setUser: Dispatch<SetStateAction<User | null>>; retry: () => void; expire: () => void };
export const SessionContext = createContext<SessionValue | null>(null);
export function useSession() { const value = useContext(SessionContext); if (!value) throw new Error('Missing session provider'); return value; }
export type StudyValue = {
  exams: Exam[]; loading: boolean; error: string; persistenceError: string; local: LocalStudy; setLocal: Dispatch<SetStateAction<LocalStudy>>;
  reload: () => Promise<void>; loadExam: (id: string, signal?: AbortSignal) => Promise<Exam>; uploadOpen: boolean; setUploadOpen: Dispatch<SetStateAction<boolean>>;
  activeTaskId: string | null; setActiveTaskId: Dispatch<SetStateAction<string | null>>; retryTask: (id: string) => Promise<void>;
};
export const StudyContext = createContext<StudyValue | null>(null);
export function useStudy() { const value = useContext(StudyContext); if (!value) throw new Error('Missing study provider'); return value; }
