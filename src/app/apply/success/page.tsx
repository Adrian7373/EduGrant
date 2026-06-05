import style from "./page.module.css";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import CopyButton from "./_components/CopyButton";

interface SuccessProps {
    searchParams: Promise<{ id?: string, batchId?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessProps) {
    const { id, batchId } = await searchParams;
    const resolvedBatchId = batchId;

    const supabase = await createClient();

    const { count: appsCount, error: totalError } = await supabase
        .from("applications")
        .select("id", { count: "exact", head: true })
        .eq("batch_id", resolvedBatchId);

    const { count: approvesCount, error: approvedError } = await supabase
        .from("applications")
        .select("id", { count: "exact", head: true })
        .eq("batch_id", resolvedBatchId)
        .eq("status", "APPROVED");

    if (totalError || approvedError) {
        throw new Error("Failed to get application count");
    }

    const safeAppsCount = appsCount ?? 0;
    const safeApprovesCount = approvesCount ?? 0;

    return (
        <div className={style.mainDiv}>
            <div className={style.card}>
                <div className={style.title}>Thank you — your application was submitted</div>
                <div className={style.counts}>
                    <div className={style.countItem}>Total applicants: {safeAppsCount}</div>
                    <div className={style.countItem}>Approved: {safeApprovesCount}</div>
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