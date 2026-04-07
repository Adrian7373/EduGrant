import style from "./RejectsCard.module.css";


export default function RejectsCard({ rejectsCount }: { rejectsCount: number }) {
    return (
        <div className={style.mainDiv}>
            <p>REJECTED</p>
            <p>{rejectsCount}</p>
        </div>
    )
}