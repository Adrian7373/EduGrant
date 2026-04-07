import style from "./ApprovesCard.module.css";


export default function RejectsCard({ approvesCount }: { approvesCount: number }) {
    return (
        <div className={style.mainDiv}>
            <p>APPROVED</p>
            <p>{approvesCount}</p>
        </div>
    )
}