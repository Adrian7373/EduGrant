import { Square } from "lucide-react";
import style from "./RecentApplications.module.css";
import Link from "next/link";

interface Application {
    id: string;
    student_level: string;
    name: string;
    status: string;
    created_at: string;
    contact: string;
    age: string;
};

interface ApplicationProp {
    recentApps: Application[];
}

export default function RecentApplications({ recentApps }: ApplicationProp) {

    return (
        <>
            <div className={style.tableHeader}>
                <p>Recent Applications</p>
                <Link className={style.viewRecordButton} href={"/records"}>View Records</Link>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Student Level</th>
                        <th>Contact</th>
                        <th>Submitted</th>
                    </tr>
                </thead>
                <tbody>
                    {recentApps.map((app) => (
                        <tr key={app.id}>
                            <td>
                                <span className={style.status}>
                                    {app.status === "PENDING" ? (
                                        <Square
                                            fill="orange"
                                            stroke="false" />
                                    ) : app.status === "APPROVED" ? (
                                        <Square
                                            fill="#13A600"
                                            stroke="false" />
                                    ) : (
                                        <Square
                                            fill="#FF5050"
                                            stroke="false" />
                                    )}
                                    <b>{app.status}</b>
                                </span>
                            </td>
                            <td>
                                {app.name}
                            </td>
                            <td>
                                {app.age}
                            </td>
                            <td>
                                {app.student_level}
                            </td>
                            <td>
                                {app.contact}
                            </td>
                            <td>
                                {new Date(app.created_at).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </>
    )
}