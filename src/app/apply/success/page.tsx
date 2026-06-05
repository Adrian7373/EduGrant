import style from "./page.module.css";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import CopyButton from "./_components/CopyButton";

interface SuccessProps {
    searchParams: Promise<{ id?: string, batch_id?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessProps) {
    const { id, batch_id } = await searchParams;

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("applications")
        .select("status")
        .eq("batch_id", batch_id);

    if (error) {
        throw new Error("Failed to get application count");
    }

    const appsCount = Array.isArray(data) ? data.length : 0;
    const approvesCount = Array.isArray(data) ? data.filter((record: any) => record.status === "APPROVED").length : 0;

    return (
        <div className={style.mainDiv}>
            <div className={style.card}>
                <div className={style.title}>Thank you — your application was submitted</div>
                <div className={style.counts}>
                    <div className={style.countItem}>Total applicants: {appsCount}</div>
                    <div className={style.countItem}>Approved: {approvesCount}</div>
                </div>

                <div className={style.copyTrackID}>
                    <div>
                        <div className={style.note}>Your application tracking ID</div>
                        <div className={style.idPill}>{id ?? "—"}</div>
                    </div>
                    <CopyButton text={id || ""} />
                </div>

                <div className={style.note}>Please save your tracking ID for future reference.</div>

                <Link className={style.trackButton} href="/track">Track your application</Link>
            </div>
        </div>
    );
}