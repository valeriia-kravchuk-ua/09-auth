'use client';
import {ReactNode, startTransition, useEffect, useState} from "react";
import {useRouter} from "next/navigation";

type Props = {
    children: ReactNode;
};

export default function AuthLayout({children}: Props) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        router.refresh();
        startTransition(() => {
            setLoading(false);
        });
    }, [router]);

    return <> {loading ? <div>Loading...</div> : children} </>
}