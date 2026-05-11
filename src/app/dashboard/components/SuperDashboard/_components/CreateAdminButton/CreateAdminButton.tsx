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

            {isOpen && (
                <div className={style.modalOverlay}>
                    <div className={style.modalContent}>
                        <form action={formAction}>
                            <label>Name:
                                <input name="name" type="text" disabled={isPending} />
                            </label><br />
                            <label>Email:
                                <input name="email" type="text" disabled={isPending} />
                            </label><br />
                            <label>Password:
                                <input name="password" type={showPassword ? "text" : "password"} disabled={isPending} />
                            </label>
                            <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isPending}>Show password</button>
                            <div className={style.modalActions}>
                                <button type="button" onClick={() => setIsOpen(false)} disabled={isPending}>Cancel</button>
                                <SubmitButton
                                    isPending={isPending}
                                />
                                <p>
                                    {isPending ? "Creating account, please wait..." : (state.errors
                                        ? `${state.message}, ${state.errors}`
                                        : `${state.message}`)}
                                </p>

                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>

    )
}