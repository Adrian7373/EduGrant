import style from "./page.module.css";
import { createClient } from "@/utils/supabase/server";
import SessionCardList from "./_components/sessionCardList/SessionCardList";

interface SuperDashboardProps {
    userName: string
}

export default async function SuperDashboard({ userName }: SuperDashboardProps) {

    const supabase = await createClient();

    const { data: sessions, error: sessionFetchError } = await supabase
        .from("batches")
        .select("id,created_at, name, max_approved, verification_code, deadline, is_active");

    if (!sessions || sessionFetchError) {
        throw new Error("Error fetching sessions");
    }

    return (
        <div className={style.mainDiv}>
            <div className={style.header}>
                <p>DASHBOARD</p>
                <p>{userName}</p>
            </div>
            <SessionCardList
                sessions={sessions}
            />
        </div>
    )
}