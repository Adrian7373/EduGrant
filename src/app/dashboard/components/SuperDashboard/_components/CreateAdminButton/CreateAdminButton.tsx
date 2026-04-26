"use client";
import style from "./CreateAdminButton.module.css";
import { useActionState, useState } from "react";
import SubmitButton from "./_components/SubmitButton";
import { createNewAdmin } from "@/app/actions";

const initialState = {
    success: false,
    message: "",
    errors: null,
};

export default function CreateAdminButton() {

    const [state, formAction, isPending] = useActionState(createNewAdmin, initialState)
    const [isOpen, setIsOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={style.mainDiv}>
            <button onClick={() => setIsOpen(true)}>Create new Admin</button>

            {isOpen && !isPending && (
                <div className={style.modalOverlay}>
                    <div className={style.modalContent}>
                        <form action={formAction}>
                            <label>Name:
                                <input name="name" type="text" />
                            </label><br />
                            <label>Email:
                                <input name="email" type="text" />
                            </label><br />
                            <label>Password:
                                <input name="password" type={showPassword ? "text" : "password"} />
                            </label>
                            <button type="button" onClick={() => setShowPassword(!showPassword)}>Show password</button>
                            <div className={style.modalActions}>
                                <button type="button" onClick={() => setIsOpen(false)}>Cancel</button>
                                <SubmitButton
                                    isPending={isPending}
                                />
                                <p>
                                    {state.errors
                                        ? `${state.message}, ${state.errors}`
                                        : `${state.message}`}
                                </p>

                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isOpen && (
                <p>Creating account, please wait...</p>
            )}
        </div>

    )
}