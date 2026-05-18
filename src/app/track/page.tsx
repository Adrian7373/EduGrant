"use client";
import { useState } from "react";
import style from "./page.module.css";
import { getTrackingDetails } from "@/app/actions";
import { redirect } from "next/navigation";

interface Result {
    application?: {
        status?: string,
        created_at?: string
    }
    message?: string
}

export default function TrackPage() {

    const [id, setId] = useState<string>("");
    const [isvalid, setIsValid] = useState<boolean>(false);
    const [result, setResult] = useState<Result | null>(null);

    const handleTracking = async () => {
        const details = await getTrackingDetails(id);
        setResult(details as Result);
        setId("");
    }

    const handleHome = () => {
        redirect("/");
    }

    return (
        <div className={style.pageContainer}>
            <div className={style.mainDiv}>
                <img className={style.logo} src="/EduGrant.svg" alt="EduGrant logo" />
                <div className={style.trackDiv}>
                    <p className={style.inputLabel}>Enter tracking ID:</p>
                    <input className={style.trackInput} value={id} type="text" onChange={(e) => {
                        setId(e.target.value)
                        e.target.value.length > 8 ? setIsValid(true) : setIsValid(false);
                    }} />
                    <div className={style.utils}>
                        <button type="button" onClick={handleHome} className={style.homeButton1}>&#9664; Home</button>
                        <button className={style.trackButton} onClick={handleTracking} disabled={!isvalid}>Track Application</button>
                    </div>

                    <div className={style.trackInfo}>
                        <p>{result ? result?.message || "Status:" : ""}</p>
                        <p>{result?.application?.status}</p><br />
                        <p>{result ? result?.message || "Date submitted:" : ""}</p>
                        <p>{result?.application?.created_at ? new Date(result.application.created_at).toLocaleDateString() : ""}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
