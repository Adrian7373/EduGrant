import style from "./SessionCard.module.css";
import { createClient } from "@/utils/supabase/server";
import ShowCodeButton from "./_components/ShowCodeButton/ShowCodeButton";

interface SessionCardProps {
    session: {
        id: string;
        name: string;
        max_approved: number;
        verification_code: string;
        deadline: string;
        is_active: boolean;
    }
}


export default async function SessionCard({ session }: SessionCardProps) {

    const supabase = await createClient();

    const { data: admin } = await supabase
        .from("batch_admins")
        .select("admin_id")
        .eq("batch_id", session.id)
        .maybeSingle();

    const { count, error } = await supabase
        .from("applications")
        .select('*', { count: 'exact', head: true })
        .eq("batch_id", session.id)
        .eq("status", "APPROVED");

    return (
        <div className={style.mainDiv}>
            <p>{session.name}</p>
            <p>{session.is_active ? "ACTIVE" : "INACTIVE"}</p>
            <p>{count}/{session.max_approved}</p>
            <ShowCodeButton
                code={session.verification_code}
            />
            <p>{session.verification_code}</p>
            <p>{admin?.admin_id ? admin.admin_id : "No assigned admin yet."}</p>
            <p>Application closes at {new Date(session.deadline).toLocaleDateString()}</p>
        </div>
    )
}