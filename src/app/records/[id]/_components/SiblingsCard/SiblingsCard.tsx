import style from "./SiblingsCard.module.css";
import { Users } from "lucide-react";

type RawDependent = {
    [key: string]: any
}

interface SiblingsCardProps {
    dependents: RawDependent[] | string | null | undefined
}

function normalizeDependent(d: RawDependent) {
    return {
        name: d.name ?? d.childrenName ?? d.children_name ?? d.full_name ?? d.fullName ?? "",
        occupation: d.occupation ?? d.childrenOccupation ?? d.children_occupation ?? d.job ?? d.work ?? ""
    }
}

export default function SiblingsCard({ dependents }: SiblingsCardProps) {
    let list: RawDependent[] = [];

    if (!dependents) {
        return (
            <>
                <p>No Siblings</p>
            </>
        )
    }

    if (typeof dependents === "string") {
        try {
            list = JSON.parse(dependents);
        } catch (e) {
            // fallback: show raw string as single entry
            list = [{ raw: dependents }];
        }
    } else if (Array.isArray(dependents)) {
        list = dependents;
    } else {
        // single object
        list = [dependents];
    }

    return (
        <>
            <p><Users width="1.5vw" height="3vh" />Siblings</p>
            {list.length === 0 && <p>N/A</p>}
            <div className={style.siblingsHolder}>
                {list.map((dependent, index) => {
                    const d = normalizeDependent(dependent as RawDependent);
                    return (
                        <div className={style.dependentDiv} key={index}>
                            <div>
                                <p>{d.name || "N/A"}</p>
                            </div>
                            <p>{d.occupation || "N/A"}</p>
                            {(!d.name && !d.occupation) && (
                                <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>
                                    {JSON.stringify(dependent, null, 2)}
                                </pre>
                            )}
                        </div>
                    )
                })}
            </div>
        </>
    )
}