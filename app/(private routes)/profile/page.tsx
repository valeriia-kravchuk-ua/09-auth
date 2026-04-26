import css from './Profile.module.css'
import Link from "next/link";
import {getMe} from "@/lib/api/serverApi";
import Image from "next/image";
import {Metadata} from "next";


export async function generateMetadata(): Promise<Metadata> {
    const user = await getMe();
    return {
        title: `Profile: ${user.username}`,
        description: `Profile: ${user.username} with email: ${user.email}`,
        openGraph: {
            title: `Profile: ${user.username}`,
            description: `Profile: ${user.username} with email: ${user.email}`,
            url: `https://notehub.com/profile`,
            siteName: 'NoteHub',
            images: [
                {
                    url: 'https://ac.goit.global/fullstack/react/default-avatar.jpg',
                    width: 1200,
                    height: 630,
                    alt: `Profile: ${user.username}`,
                },
            ],
            type: 'article',
        },
    }
}

export default async function Profile() {
    const user = await getMe();

    return (
        <main className={css.mainContent}>
            <div className={css.profileCard}>
                <div className={css.header}>
                    <h1 className={css.formTitle}>Profile Page</h1>
                    <Link href="/profile/edit" className={css.editProfileButton}>
                        Edit Profile
                    </Link>
                </div>
                <div className={css.avatarWrapper}>
                    <Image
                        src={user?.avatar}
                        alt="User Avatar"
                        width={120}
                        height={120}
                        className={css.avatar}
                    />
                </div>
                <div className={css.profileInfo}>
                    <p>
                        Username: {user?.username}
                    </p>
                    <p>
                        Email: {user?.email}
                    </p>
                </div>
            </div>
        </main>

    );
}