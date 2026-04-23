"use client";

import style from "./SideBar.module.css"
import Link from "next/link";
import { signoutUser } from "@/app/actions";

interface BatchOption {
    id: string;
    name: string;
}

interface SideBarProps {
    assignedBatches?: BatchOption[];
    currentBatchId?: string;
    isFallback?: boolean;
}

export function SideBar({ assignedBatches, currentBatchId, isFallback }: SideBarProps) {

    const handleSignOut = () => {
        const hasConfirmed = window.confirm(`Are you sure you want to logout?`);

        if (!hasConfirmed) {
            return;
        }

        signoutUser();
    }


    return (
        <div className={style.mainDiv}>
            <p className={style.title}>GABAY AYUDA</p>
            {assignedBatches && assignedBatches.length > 0 && (
                <div className={style.batchDiv}>
                    <p>Active Branches:</p>
                    <select name="currentBatch">
                        {assignedBatches.map((batch) => (
                            <option value={batch.id}>{batch.name}</option>
                        ))}
                    </select>
                </div>
            )}

            <div className={style.utils}>
                <Link className={style.dashboardButton} href="/dashboard">DASHBOARD</Link>
                <Link className={style.recordsButton} href="/records">RECORDS</Link>
                <button onClick={handleSignOut}>Sign Out</button>
            </div>
        </div>

    )
}

export default SideBar;