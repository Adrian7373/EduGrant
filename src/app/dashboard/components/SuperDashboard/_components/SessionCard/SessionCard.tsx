import style from "./SessionCard.module.css";
import { createClient } from "@/utils/supabase/server";

interface SessionCardProps {
    id: string;
    created_at: string;
    name: string;
    max_approved: number;
    verification_code: string;
    deadline: string;
    is_active: boolean;
}

export default async function SessionCard({ id, created_at, name, max_approved,
    verification_code, deadline, is_active }: SessionCardProps) {

    const supabase = await createClient();

    const { data: admin } = await supabase
        .from("batch_admins")
        .select("admin_id")
        .eq("batch_id", id)
        .maybeSingle()

    if (!admin?.admin_id) {
        console.log("No assigned admin yet.")
    }


    return (
        <div className={style.mainDiv}>
            <p>{name}</p>
            <p>{is_active ? "ACTIVE" : "INACTIVE"}</p>
            <p>{verification_code}</p>

        </div>
    )
}