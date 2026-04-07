import style from "./PendingApplicationsCard.module.css";


export default function PendingApplicationsCard({ pendingCount }: { pendingCount: number }) {
    return (
        <div className={style.mainDiv}>
            <p>PENDING APPLICATIONS</p>
            <p>{pendingCount}</p>
        </div>
    )
}