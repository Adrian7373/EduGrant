"use client";
import { useState } from "react";
import style from "./DeleteSessionButton.module.css";

export default function DeleteButton() {

    const [isOpen, setIsOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("");

    return (
        <div className={style.mainDiv}>
            <button onClick={() => setIsOpen(true)}>Delete Session</button>

            {
                isOpen && (
                    <div className={style.modalOverlay}>
                        <div className={style.modalContent}>
                            <p>Are you sure?</p>
                            <p>This action cannot be undone. This will permanently delete "" session</p>
                            <p>Please type "" to confirm</p>
                            <input type="text" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
                            <div className={style.modalActions}>
                                <button onClick={() => setIsOpen(false)}>Cancel</button>
                                <button>Delete</button>
                            </div>
                        </div>
                    </div>
                )
            }

        </div>
    )
}