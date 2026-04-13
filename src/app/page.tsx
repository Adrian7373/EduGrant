import style from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={style.mainDiv}>
      <p className={style.header}>Gabay Ayuda: Empowering the Future of Our Youth</p>
      <div className={style.applyButton}>
        <Link className={style.link} href="/apply">Apply for Assistance</Link>
      </div>
      <div className={style.trackButton}>
        <Link className={style.link2} href="/track">Track my Application</Link>
      </div>

    </div>
  )
}