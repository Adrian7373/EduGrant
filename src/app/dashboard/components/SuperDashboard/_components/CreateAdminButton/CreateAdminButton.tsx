"use client";
import style from "./CreateAdminButton.module.css";
import { useState } from "react";

export default function CreateAdminButton() {

    const [isOpen, setIsOpen] = useState(false);
    const [newAdminName, setNewAdminName] = useState("");

    return (
        <div className={style.mainDiv}>
            <button onClick={() => setIsOpen(true)}>Create new Admin</button>

            {isOpen && (
                <div className={style.modalOverlay}>
                    <div className={style.modalContent}>
                        <label>Name:
                            <input type="text" onChange={(e) => setNewAdminName(e.target.value)} />
                        </label>
                        <div className={style.modalActions}>
                            <button onClick={() => setIsOpen(false)}>Cancel</button>
                            <button >Create</button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    )
}