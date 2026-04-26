'use client'
import css from './SignUp.module.css'
import {useRouter} from "next/navigation";
import {useState} from "react";
import { register, RegisterRequest} from "@/lib/api/clientApi";
import {useAuthStore} from "@/lib/store/authStore";
import axios from "axios";

export default function  SignUp() {
    const router = useRouter();
    const [error, setError] = useState('');

    const { setUser } = useAuthStore();

    const handleSubmit = async (formData: FormData) => {
        try {
            const formValues = Object.fromEntries(formData) as RegisterRequest;
            const res = await register(formValues);

            if (res) {
                console.log('res-register-user', res)
                setUser(res);
                router.push('/profile');
            } else {
                setError('Invalid email or password');
                console.log('ERROR:(((', error)
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message ??
                    error.response?.data?.error ??
                    error.message ??
                    "Oops... some error"
                );
                return;
            }
        }
    };
    return (
        <main className={css.mainContent}>
            <h1 className={css.formTitle}>Sign up</h1>
            <form className={css.form} action={handleSubmit}>

                <div className={css.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" name="email" className={css.input} required/>
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" name="password" className={css.input} required/>
                </div>

                <div className={css.actions}>
                    <button type="submit" className={css.submitButton}>
                        Register
                    </button>
                </div>

                <p className={css.error}>{error}</p>
            </form>
        </main>

    )
}