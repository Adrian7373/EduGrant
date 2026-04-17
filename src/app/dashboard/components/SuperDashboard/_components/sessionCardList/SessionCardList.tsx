import style from "./SessionCardList.module.css";
import SessionCard from "../SessionCard/SessionCard";

interface Profile {
    id: string,
    name: string
}

interface Session {
    id: string;
    created_at: string;
    name: string;
    max_approved: number;
    verification_code: string;
    deadline: string;
    is_active: boolean;
}

interface SessionCardListProps {
    profiles: Profile[],
    sessions: Session[]
}

export default function SessionCardList({ profiles, sessions }: SessionCardListProps) {



    return (
        <div className={style.mainDiv}>
            {sessions.map((session) => (
                <SessionCard key={session.id}
                    session={session}
                />
            ))}
        </div>
    )
}