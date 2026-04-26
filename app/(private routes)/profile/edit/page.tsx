'use client';
import css from './Edit.module.css'
import {useAuthStore} from "@/lib/store/authStore";
import {register, RegisterRequest, updateMe} from "@/lib/api/clientApi";
import axios from "axios";
import {useEffect, useState} from "react";
import {router} from "next/client";
import {useRouter} from "next/navigation";


export default function EditProfile() {
    const router = useRouter()
    const setUser = useAuthStore((state) => state.setUser);
    const user = useAuthStore((state) => state.user);
    const [username, setUserName] = useState(user?.username ?? "")
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(event.target.value);
    };
    const handleSaveUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const email = user?.email ?? "";
        console.log("UPDATE PAYLOAD:", {email});
        const updatedUser = await updateMe({ username, email });
        setUser(updatedUser);
        router.push('/profile')
    }
    useEffect(() => {
        setUserName(user?.username ?? "");
    }, [user?.username]);

    return (
        <main className={css.mainContent}>
            <div className={css.profileCard}>
                <h1 className={css.formTitle}>Edit Profile</h1>

                <img src={user?.avatar}
                     alt="User Avatar"
                     width={120}
                     height={120}
                     className={css.avatar}
                />

                <form className={css.profileInfo} onSubmit={handleSaveUser}>
                    <div className={css.usernameWrapper}>
                        <label htmlFor="username">Username:</label>
                        <input id="username"
                               type="text"
                               className={css.input}
                               value={username}
                               onChange={handleChange}
                        />
                    </div>

                    <p>Email: {user?.email}</p>

                    <div className={css.actions}>
                        <button type="submit" className={css.saveButton}>
                            Save
                        </button>
                        <button type="button" className={css.cancelButton} onClick={() => router.back()}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </main>

    )
}