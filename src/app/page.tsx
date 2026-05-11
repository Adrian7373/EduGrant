import style from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={style.mainDiv}>
      <p className={style.header}>EduGrant: Empowering the Future of Our Youth</p>
      <div className={style.buttonsDiv}>
        <Link className={style.applyButton} href="/apply">Apply for Assistance</Link>
        <Link className={style.trackButton} href="/track">Track my Application</Link>
      </div>
    </div>
  )
}