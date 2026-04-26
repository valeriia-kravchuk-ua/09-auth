import {Note} from "@/types/note";
import {baseLocalUrl} from "@/lib/api/api";
import {User} from "@/types/user";


interface NotesResponse {
    notes: Note[];
    totalPages: number;
}

export  type Tag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

export interface CreateNoteRequest {
    title: string;
    content: string;
    tag: Tag;
}

export type RegisterRequest = {
    email: string;
    password: string;
    username: string;
};
export type LoginRequest = {
    email: string;
    password: string;
};
export type UpdateRequest = {
    username: string;
}
type CheckSessionRequest = {
    success: boolean;
};

export async function fetchNotes(page?: number, query?: string, tag?: Tag): Promise<NotesResponse> {
    const response = await baseLocalUrl.get<NotesResponse>(
        "/notes",
        {
            params: {
                page,
                tag,
                perPage: 6,
                ...(query ? {search: query} : {}),
            }
        },
    );
    return response.data;

}


export const fetchNoteById = async (id: string) => {
    const res = await baseLocalUrl.get<Note>(`/notes/${id}`);
    return res.data;
};

export async function createNote(data: CreateNoteRequest): Promise<Note> {
    const response = await baseLocalUrl.post<Note>("/notes", data);
    return response.data;
}

export async function deleteNote(
    id: string
): Promise<Note> {
    const response = await baseLocalUrl.delete<Note>(
        `/notes/${id}`,
    );
    return response.data;
}

export const register = async (data: RegisterRequest) => {
    const res = await baseLocalUrl.post<User>('/auth/register', data);
    return res.data;
};


export const login = async (data: LoginRequest) => {
    const res = await baseLocalUrl.post<User>('/auth/login', data);
    return res.data;
};

export const logout = async (): Promise<void> => {
    await baseLocalUrl.post('/auth/logout')
};

export async function checkSession() {
    const res = await baseLocalUrl.get<CheckSessionRequest>('/auth/session');
    return res.data.success;
}

export const getMe = async () => {
    const {data} = await baseLocalUrl.get<User>('/users/me');
    return data;
};

export async function updateMe(data: UpdateRequest) {
    const res = await baseLocalUrl.patch<User>('/users/me', data);
    return res.data;
}