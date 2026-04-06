"use client";

import { useState } from "react";
import style from "./page.module.css";
import { authenticateUser } from "../actions";

export default function LoginForm() {

    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        const formElement = e.currentTarget.closest('form');
        e.preventDefault();

        if (!formElement) return;
        setIsAuthenticating(true);

        const formData = new FormData(formElement);

        const response = await authenticateUser(formData);

        if (!response.success) {
            console.log(response.message);
            return;
        }

        console.log(response.message);

    }

    return (
        <div className={style.formDiv}>
            <p>LOG IN</p>
            <form action="POST" onSubmit={handleLogin}>
                <label>Username:
                    <input name="email" type="text" />
                </label>
                <label>Password:
                    <input name="password" type="text" />
                </label>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}