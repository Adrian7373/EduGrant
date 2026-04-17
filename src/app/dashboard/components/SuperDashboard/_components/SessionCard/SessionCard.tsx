import style from "./SessionCard.module.css";

interface SessionCardProps {
    id: string;
    created_at: string;
    name: string;
    max_approved: number;
    verification_code: string;
    deadline: string;
    is_active: boolean;
}

export default function SessionCard({ id, created_at, name, max_approved,
    verification_code, deadline, is_active }: SessionCardProps) {



    return (
        <div className={style.mainDiv}>
            <p>{name}</p>
            <p>{is_active ? "ACTIVE" : "INACTIVE"}</p>
            <p>{verification_code}</p>

        </div>
    )
}