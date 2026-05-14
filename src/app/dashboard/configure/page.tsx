import { redirect } from "next/navigation";

export default async function Configure() {
    // This route has been moved to a modal component in SuperDashboard
    // Redirect to dashboard to access the configure functionality
    redirect("/dashboard");
}