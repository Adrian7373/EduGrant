"use client";
import style from "./batchForm.module.css";
import { createBatch } from "@/app/actions";

interface Profile {
    id: string,
    name: string
}

interface BatchFormProps {
    profiles: Profile[] | null
    initialData?: {
        batchId?: string,
        adminName?: string,
        adminId?: string,
        name?: string,
        max_approved?: number,
        verification_code?: string,
        deadline?: string,
        is_active?: boolean
    } | null
}

export default function BatchForm({ profiles, initialData }: BatchFormProps) {

    const isEditing = !!initialData;

    return (
        <div className={style.mainDiv}>
            {isEditing && (
                <input type="hidden" name="batchId" value={initialData.batchId} />
            )}
            <div className={style.formDiv}>
                <form action={createBatch}>
                    <label>Name:
                        <input name="name" type="text" required defaultValue={initialData?.name} />
                    </label>
                    <label>Max Beneficiaries:
                        <input name="max_ben" type="text" defaultValue={initialData?.max_approved} />
                    </label>
                    <label>Set Verification Code:
                        <input name="code" type="text" required defaultValue={initialData?.verification_code} />
                    </label>
                    <label>Deadline:
                        <input name="deadline" type="date" defaultValue={initialData?.deadline} />
                    </label>
                    <label>Assign Admin:
                        <select name="assignedAdmin" defaultValue={initialData?.adminId}>
                            {!profiles ? (
                                <option value="" disabled >No admin available</option>
                            ) : (
                                profiles.map((profile) => (
                                    <option key={profile.id} value={profile.id}>{profile.name}</option>
                                ))
                            )}
                        </select>
                    </label>
                    <button type="submit">Create</button>
                </form>
            </div>
        </div>
    )
}