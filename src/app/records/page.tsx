import SideBar from "@/components/SideBar/SideBar";
import RecordsTable from "./_components/RecordsTable";
import { createClient } from "@supabase/supabase-js";
import style from "./page.module.css";

export default async function Records() {

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const { data, error } = await supabase
        .from("applications")
        .select("id, name, student_level, status, created_at, contact");

    if (error || data == null) {
        return <div>Failed to fetch data from database.</div>
    }

    return (
        <div className={style.mainDiv}>
            <SideBar />
            <p>RECORDS</p>
            <RecordsTable
                applications={data}
            />
        </div>
    )
}