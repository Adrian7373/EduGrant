"use client"
import style from "./RecordHeader.module.css";
import { useRouter } from "next/navigation";
import { ArrowBigLeft } from "lucide-react";

interface RecordHeaderProps {
    name: string,
    status: string
}

export default function RecordHeader({ name, status }: RecordHeaderProps) {

    const router = useRouter();

    return (
        <>
            <div className={style.backName}>
                <button onClick={() => router.back()}><ArrowBigLeft height="80%" width="3vw" fill="white" /></button>
                <p>{name}</p>
            </div>
            <p>{status}</p>
        </>
    )
}