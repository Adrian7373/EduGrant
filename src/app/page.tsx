import style from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (<>
    <img className={style.logo} src="EduGrant.svg" alt="edugrant logo" />
    <div className={style.mainDiv}>
      <p className={style.header}>Empowering the Future of Our Youth</p>
      <div className={style.buttonsDiv}>
        <Link className={style.applyButton} href="/apply">Apply</Link>
        <Link className={style.trackButton} href="/track">Track my Application</Link>
      </div>
    </div>
  </>
  )
}