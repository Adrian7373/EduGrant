"use client";

import { useState } from "react";
import Papa from "papaparse";
import { getAllApplicationsForExport } from "@/app/actions";

export default function ExportCSVButton() {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const rawData = await getAllApplicationsForExport();

            const formattedData = rawData.map(app => {

                const formattedDependents = app.dependents && app.dependents.length > 0
                    ? app.dependents.map((child: any, index: number) =>
                        `${index + 1}. ${child.childrenName} (${child.childrenOccupation || 'N/A'} - ${child.childrenYearLevel || 'N/A'})`
                    ).join('\n') // The \n tells Excel to drop to a new line inside the same cell
                    : "None";

                return {
                    "Tracking ID": app.tracking_id,
                    "Status": app.status,
                    "Name": app.name,
                    "Age": app.age,
                    "Sex": app.sex,
                    "Religion": app.religion,
                    "Citizenship": app.citizenship,
                    "Birthdate": app.bday,
                    "Marital Status": app.marital_status,
                    "Email": app.email || "N/A",
                    "Address": app.address,
                    "School Level": app.student_level,
                    "School Name": app.school_name,
                    "Course": app.course || "N/A",
                    "GWA / Average": app.gwa || app.average || "N/A",
                    "Total Income": app.total_income,
                    "Contact": app.contact,
                    "Date Applied": new Date(app.created_at).toLocaleDateString(),
                    "Mother Name": app.mother_name,
                    "Mother Age": app.mother_age,
                    "Mother Address": app.mother_address,
                    "Mother Contact": app.mother_contact,
                    "Mother Occupation": app.mother_occupation,
                    "Mother Educational Attainment": app.mother_educ_attainment,
                    "Father Name": app.father_name,
                    "Father Age": app.father_age,
                    "Father Address": app.father_address,
                    "Father Contact": app.father_contact,
                    "Father Occupation": app.father_occupation,
                    "Father Educational Attainment": app.father_educ_attainment,
                    "Dependents Information": formattedDependents
                }
            });

            const csv = Papa.unparse(formattedData);

            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `EduGrant_Records_${new Date().toISOString().split('T')[0]}.csv`);

            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Export Error:", error);
            alert("Failed to export records. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={isExporting}
            style={{ padding: '10px 16px', borderRadius: '8px', backgroundColor: '#7C3AED', color: 'white', border: 'none', cursor: 'pointer' }}
        >
            {isExporting ? "Preparing File..." : "Download CSV"}
        </button>
    );
}