
import {Note} from "@/types/note";
import {Tag} from "@/lib/api/clientApi";


import {cookies} from "next/headers";
import {baseLocalUrl} from "./api";
import {User} from "@/types/user";

interface NotesResponse {
    notes: Note[];
    totalPages: number;
}

export async function fetchNotes(page?: number, query?: string, tag?: Tag): Promise<NotesResponse> {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const response = await baseLocalUrl.get<NotesResponse>(
        "/notes",
        {
            params: {
                page,
                tag,
                perPage: 6,
                ...(query ? {search: query} : {}),
            },
            headers: {
                Cookie: cookieHeader,
            },

        },
    );
    return response.data;

}


export const fetchNoteById = async (id: string) => {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const res = await baseLocalUrl.get<Note>(`/notes/${id}`, {
        headers: {
            Cookie: cookieHeader,
        },
    });
    return res.data;
};

export async function getMe() {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const res = await baseLocalUrl.get<User>("/users/me", {
        headers: {
            Cookie: cookieHeader,
        },
    });

    return res.data;
}

export const checkServerSession = async () => {
    const cookieStore = await cookies();
    const res = await baseLocalUrl.get('/auth/session', {
        headers: {
            Cookie: cookieStore.toString(),
        },
    });
    return res;
};