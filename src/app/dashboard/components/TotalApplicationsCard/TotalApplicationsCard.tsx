import style from "./TotalApplicationsCard.module.css";

export default function TotalApplicationsCard({ totalCount }: { totalCount: number }) {
    return (
        <div className={style.mainDiv}>
            <p>Total applications</p>
            <p>{totalCount}</p>
        </div>
    )
}