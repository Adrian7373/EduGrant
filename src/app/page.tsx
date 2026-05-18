import style from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={style.heroContainer}>
      {/* Note: I added a forward slash (/) to the src. 
        This ensures Next.js always looks in your 'public' folder for it! 
      */}
      <img className={style.logo} src="/EduGrant.svg" alt="EduGrant logo" />

      <div className={style.contentWrapper}>
        <h1 className={style.headline}>Empowering the Future of Our Youth</h1>

        <p className={style.subheadline}>
          Providing accessible financial assistance and streamlined
          scholarship tracking for senior high and college students.
        </p>

        <div className={style.buttonsDiv}>
          <Link className={style.applyButton} href="/apply">Apply</Link>
          <Link className={style.trackButton} href="/track">Track my Application</Link>
        </div>
      </div>
    </main>
  );
}