import style from "./SubmitButton.module.css";

export default function SubmitButton({ isPending }: { isPending: boolean }) {

    return (
        <button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create"}
        </button>
    )
}