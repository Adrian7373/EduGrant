"use client";
import style from "./ActionButtons.module.css";
import { updateRecordStatus } from "@/app/actions";
import { SquarePen } from "lucide-react";

export default function ActionButtons({ id }: { id: string }) {
    return (
        <>
            <p><SquarePen height="3vh" width="1.5vw" />ACTIONS</p>
            <div className={style.buttonsDiv}>
                <button onClick={() => updateRecordStatus(id, "APPROVED")}>Approve</button>
                <button onClick={() => updateRecordStatus(id, "REJECTED")}>Reject</button>
            </div>
        </>

    )
}