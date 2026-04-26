import NotePreviewClient from "./NotePreview.client";
import {HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {dehydrate} from "@tanstack/query-core";
import {fetchNoteById} from "@/lib/api/serverApi";

type Props = {
    params: Promise<{ id: string }>;
};

const NotePreview = async ({params}: Props) => {
    const {id} = await params;


    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["note", id],
        queryFn: () => fetchNoteById(id),
    });

    return(
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NotePreviewClient/>
        </HydrationBoundary>
    )


};

export default NotePreview;
