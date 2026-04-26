"use client";
import { useState } from "react";
import style from "./AssignAdminButton.module.css";

interface Profile {
    id: string,
    name: string
}

interface AssignAdminButtonProps {
    profiles: Profile[] | null
}

export default function AssignAdminButton({ profiles }: AssignAdminButtonProps) {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={style.mainDiv}>
            <button onClick={() => setIsOpen(true)}>Assign Admin</button>
            {isOpen && (
                <div className={style.modalOverlay}>
                    <div className={style.modalContent}>

                    </div>
                </div>
            )}
        </div>
    )
}