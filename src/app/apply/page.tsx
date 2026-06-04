"use client";

import { useState, useRef, useEffect } from "react"
import style from "./page.module.css"
import { submitApplication, checkNameExists } from "../actions";
import { useRouter } from "next/navigation";
import { verifyCode } from "../actions";
import imageCompression from "browser-image-compression";


export default function ApplicationForm() {
    type UploadKey = "coe" | "cog" | "validID";
    const MAX_UPLOAD_MB = 5;

    const [formStep, setFormStep] = useState<number>(1);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const formRef = useRef<HTMLFormElement>(null);
    const [isCollegeStudent, setIsCollegeStudent] = useState<boolean>(false);
    const [dependents, setDependents] = useState<number>(0);
    const [childrenOccupations, setChildrenOccupations] = useState<string[]>([]);
    const [childrenSpecs, setChildrenSpecs] = useState<string[]>([]);
    const [fname, setFname] = useState("");
    const [midname, setMidname] = useState("");
    const [lname, setLname] = useState("");
    const [nameStatus, setNameStatus] = useState<"idle" | "checking" | "record already exists!" | "Available for application">("idle");
    const nameInputRef = useRef<HTMLInputElement>(null);
    const [code, setCode] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [verifiedBatchId, setVerifiedBatchId] = useState<string | null>(null)
    const [selectedFiles, setSelectedFiles] = useState<{ coe: string; cog: string; validID: string }>({ coe: "", cog: "", validID: "" });
    const [processedFiles, setProcessedFiles] = useState<Record<UploadKey, File | null>>({ coe: null, cog: null, validID: null });
    const [isProcessingFile, setIsProcessingFile] = useState<Record<UploadKey, boolean>>({ coe: false, cog: false, validID: false });
    const router = useRouter();
    const fullName = [fname, midname, lname]
        .map((part) => part.trim())
        .filter(Boolean)
        .join(" ")
        .trim();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fileType: UploadKey) => {
        if (!e.target.files || !e.target.files[0]) return;

        const originalFile = e.target.files[0];
        setIsProcessingFile(prev => ({ ...prev, [fileType]: true }));

        try {
            let finalFile = originalFile;

            // Compress only images. Other file types keep original quality.
            if (originalFile.type.startsWith("image/")) {
                finalFile = await imageCompression(originalFile, {
                    maxSizeMB: 2,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    initialQuality: 0.8,
                });
            }

            const sizeInMB = finalFile.size / (1024 * 1024);
            if (sizeInMB > MAX_UPLOAD_MB) {
                setProcessedFiles(prev => ({ ...prev, [fileType]: null }));
                setSelectedFiles(prev => ({ ...prev, [fileType]: "" }));
                e.target.value = "";
                alert(`File is too large (${sizeInMB.toFixed(2)}MB). Please upload a file under ${MAX_UPLOAD_MB}MB.`);
                return;
            }

            setProcessedFiles(prev => ({ ...prev, [fileType]: finalFile }));
            setSelectedFiles(prev => ({
                ...prev,
                [fileType]: `${finalFile.name} (${sizeInMB.toFixed(2)}MB)`
            }));
        } catch (error) {
            console.error("File processing failed:", error);
            setProcessedFiles(prev => ({ ...prev, [fileType]: null }));
            setSelectedFiles(prev => ({ ...prev, [fileType]: "" }));
            e.target.value = "";
            alert("Could not process this file. Please try another file.");
        } finally {
            setIsProcessingFile(prev => ({ ...prev, [fileType]: false }));
        }
    };

    const handleVerify = async () => {
        if (!code) return;

        const response = await verifyCode(code);

        setMessage(response.message);

        if (response.id) setVerifiedBatchId(response.id);

    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        const formElement = e.currentTarget.closest('form');
        e.preventDefault()

        if (!formElement) return;

        if (Object.values(isProcessingFile).some(Boolean)) {
            alert("Please wait for file processing to finish.");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData(formElement);

        // Replace raw uploads with client-processed files (compressed images)
        (Object.keys(processedFiles) as UploadKey[]).forEach((key) => {
            const file = processedFiles[key];
            if (file) {
                formData.set(key, file, file.name);
            }
        });

        const response = await submitApplication(formData);

        if (response.success) {
            alert(response.message);
            setIsSubmitting(false);
            return;
        }

        // If there are field-level errors, show them concisely to the user
        if ((response as any).errors) {
            const fieldErrors: Record<string, string[]> = (response as any).errors;
            const messages = Object.entries(fieldErrors)
                .flatMap(([field, msgs]) => msgs.map((m) => `${field}: ${m}`))
                .join('\n');
            alert(messages || response.message);
        } else {
            alert(response.message);
        }

        setIsSubmitting(false);

    }

    useEffect(() => {
        if (nameStatus == "record already exists!") {
            nameInputRef.current?.focus();
        }
    }, [nameStatus])

    useEffect(() => {
        if (fullName.length < 2) {
            setNameStatus("idle");
            return;
        }
        setNameStatus("checking");
        console.log(fullName);
        const delayBounce = setTimeout(async () => {
            const isDuplicate = await checkNameExists(fullName);
            isDuplicate ? setNameStatus("record already exists!")
                : setNameStatus("Available for application")
                ;
        }, 3000)

        return () => clearTimeout(delayBounce);

    }, [fullName]);

    const handleDependents = (value: string) => {
        if (!value) return;
        const numberOfDependents = Number(value);
        if (numberOfDependents > 0) {
            setDependents(numberOfDependents);
            setChildrenOccupations(prev => {
                const arr = Array(numberOfDependents).fill("");
                for (let i = 0; i < Math.min(prev.length, numberOfDependents); i++) arr[i] = prev[i];
                return arr;
            });
            setChildrenSpecs(prev => {
                const arr = Array(numberOfDependents).fill("");
                for (let i = 0; i < Math.min(prev.length, numberOfDependents); i++) arr[i] = prev[i];
                return arr;
            });
        } else {
            setDependents(0);
            setChildrenOccupations([]);
            setChildrenSpecs([]);
        }
    }

    const handleChildOccupationChange = (index: number, value: string) => {
        setChildrenOccupations(prev => {
            const copy = [...prev];
            copy[index] = value;
            return copy;
        });

        if (value !== 'others') {
            setChildrenSpecs(prev => {
                const copy = [...prev];
                copy[index] = "";
                return copy;
            });
        }
    }

    const handleChildSpecChange = (index: number, value: string) => {
        setChildrenSpecs(prev => {
            const copy = [...prev];
            copy[index] = value;
            return copy;
        });
    }

    const handleNext = () => {
        if (!formRef.current) return;

        const stepInputs = formRef.current.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
            `#step-${formStep} input, #step-${formStep} select, #step-${formStep} textarea`
        );

        for (const input of Array.from(stepInputs)) {
            if (!input.checkValidity()) {
                input.reportValidity();

                return;
            }
        }

        // 4. If the loop finishes without returning, everything is valid!
        setFormStep(prev => prev + 1);
    };
    const handleBack = () => setFormStep(prevStep => prevStep - 1);

    const handleStudentLevel = (value: string) => {
        value == "college" ? setIsCollegeStudent(true) : setIsCollegeStudent(false);
    }

    if (!verifiedBatchId) return (
        <div className={style.pageContainer}>
            <div className={style.verifyDiv}>
                <img className={style.logo} src="/EduGrant.svg" alt="EduGrant logo" />
                <p>Enter Verification Code</p>
                <input type="text" onChange={(e) => setCode(e.target.value)} />
                <p>{message}</p>
                <div className={style.verifyUtils}>
                    <button type="button" onClick={() => router.back()} className={style.homeButton} hidden={formStep !== 1}>&#9664; Home</button>
                    <button type="button" className={style.verifyButton} onClick={handleVerify}>Proceed</button>
                </div>
            </div>
        </div>)



    if (verifiedBatchId) return (
        <div className={style.mainDiv}>
            <form action="POST" onSubmit={handleSubmit} ref={formRef}>
                <div id="step-1" className={style.personalInfoDiv} hidden={formStep != 1}>
                    <p className={style.header}>PERSONAL INFORMATION</p>
                    <button type="button" onClick={() => router.back()} className={style.homeButton} hidden={formStep !== 1}>&#9664; Home</button>
                    <input type="hidden" value={fullName} name="name" />
                    <input type="hidden" value={verifiedBatchId} name="batch_id" />
                    <label>First Name:
                        <input placeholder="e.g Juan" ref={nameInputRef} onChange={(e) => setFname(e.target.value)} required name="fname" type="text" className={style.nameInput} />
                    </label>
                    <label>Middle Name {"(Leave empty if none)"}:
                        <input placeholder="e.g Reyes" ref={nameInputRef} onChange={(e) => setMidname(e.target.value)} name="midname" type="text" className={style.nameInput} />
                    </label>
                    <label>Last Name:
                        <input placeholder="e.g Dela Cruz" ref={nameInputRef} onChange={(e) => setLname(e.target.value)} required name="lname" type="text" className={style.nameInput} />
                        {nameStatus === 'checking' && <p style={{ color: '#ffffff', fontSize: '1rem' }}>Checking...</p>}
                        {nameStatus === 'record already exists!' && <p style={{ color: '#fb2a2a', fontSize: '1rem' }}>Your application is already submitted</p>}
                        {nameStatus === 'Available for application' && <p style={{ color: '#2be11a', fontSize: '1rem' }}>Eligible for application</p>}
                    </label>

                    <label>Age:
                        <input required name="age" type="number" min={5} className={style.ageInput} />
                    </label>
                    <label>Sex:
                        <select name="sex" id="sex" required>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </label>
                    <label>Religion:
                        <input name="religion" type="text" className={style.religionInput} />
                    </label>
                    <label>Citizenship:
                        <input placeholder="e.g Filipino" required name="citizenship" type="text" className={style.citizenShipInput} />
                    </label>
                    <label>Date of Birth:
                        <input required name="bday" type="date" className={style.bdayInput} />
                    </label>
                    <label>Marital Status:
                        <select required name="maritalStatus" id="maritalStatus" className={style.maritalStatusInput} defaultValue="">
                            <option value="" disabled hidden>Select an option</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Separated">Separated</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                        </select>
                    </label>

                    <label>Contact number:
                        <input placeholder="09XXXXXXXXX" required minLength={11} name="contact" type="tel" className={style.contactInput} />
                    </label>

                    <label>Email{"(optional)"}:
                        <input placeholder="e.g sample@gmail.com" name="email" type="email" className={style.emailInput} />
                    </label>

                    <label>Permanent Address:
                        <input required name="address" type="text" className={style.permAddressInput} />
                    </label>

                    <label>School Type:
                        <select required name="schoolType" id="schoolType" className={style.schoolTypeInput} defaultValue="">
                            <option value="" disabled hidden>Select an option</option>
                            <option value="Private">Private</option>
                            <option value="Public">Public</option>
                            <option value="Vocational">Vocational</option>
                        </select>
                    </label>

                    <label>School Name:
                        <input placeholder="e.g Paaralan National High School" required name="schoolName" type="text" className={style.schoolNameInput} />
                    </label>

                    <label>School Address:
                        <input required name="schoolAddress" type="text" className={style.schoolAddressInput} />
                    </label>

                    <label>Student Level:
                        <select onChange={(e) => handleStudentLevel(e.target.value)} required name="studentLevel" id="studentLevel" className={style.studentLevelInput} defaultValue="">
                            <option value="" disabled hidden>Select an option</option>
                            <option value="Junior">Junior High Student</option>
                            <option value="Senior">Senior High Student</option>
                            <option value="College">College Student</option>
                        </select>
                    </label>

                    {isCollegeStudent && (
                        <>
                            <label>Year Level:
                                <select required name="yearLevel" id="yearLevel" className={style.yearLevelInput} defaultValue="">
                                    <option value="" disabled hidden>Select an option</option>
                                    <option value="1st Year College">1st Year College</option>
                                    <option value="2nd Year College">2nd Year College</option>
                                    <option value="3rd Year College">3rd Year College</option>
                                    <option value="4th Year College">4th Year College</option>
                                    <option value="5th Year College">5th Year College</option>
                                    <option value="5th Year College">Undergraduate</option>
                                </select>
                            </label>

                            <label>Course:
                                <input placeholder="e.g BSIT" name="course" type="text" className={style.courseInput} />
                            </label>
                            <label>General Weighted Average(GWA):
                                <input max={5} min={1} required name="gwa" type="number" step="0.01" className={style.gwaInput} />
                            </label>
                        </>
                    )}

                    {!isCollegeStudent && (
                        <>
                            <label>Grade:
                                <select required name="gradeLevel" id="gradeLevel" className={style.gradeLevelInput} defaultValue="">
                                    <option value="" disabled hidden>Select an option</option>
                                    <option value="Grade 7">Grade 7</option>
                                    <option value="Grade 8">Grade 8</option>
                                    <option value="Grade 9">Grade 9</option>
                                    <option value="Grade 10">Grade 10</option>
                                    <option value="Grade 11">Grade 11</option>
                                    <option value="Grade 12">Grade 12</option>
                                </select>
                            </label>

                            <label>Grade Average:
                                <input min={65} placeholder="XX" required name="average" type="number" step="0.01" className={style.averageInput} />
                            </label>
                        </>
                    )}

                </div>


                {/*STEP 2 FAMILY BACKGROUND*/}

                <div id="step-2" className={style.familyBackgroundDiv} hidden={formStep != 2}>
                    <p className={style.header}>FAMILY BACKGROUND</p>

                    <label>Parents Total Monthly Income:
                        <input min={0} placeholder="e.g 5000" name="totalIncome" type="number" className={style.totalIncomeInput} />
                    </label>

                    <label>Number of Child(0 if only no siblings):
                        <input min={0} onChange={(e) => handleDependents(e.target.value)} required name="numberOfChild" type="number" className={style.numberOfChildInput} />
                    </label>
                </div>

                {/*MOTHER INFORMATION*/}

                <div id="step-3" className={style.motherInfoDiv} hidden={formStep != 3}>
                    <p className={style.header}>MOTHER INFORMATION</p>

                    <label>Name:
                        <input name="motherName" type="text" className={style.motherNameInput} />
                    </label>
                    <label>Age:
                        <input min={1} name="motherAge" type="text" className={style.motherAgeInput} />
                    </label>
                    <label>Address:
                        <input name="motherAddress" type="text" className={style.motherAddressInput} />
                    </label>
                    <label>Contact Number:
                        <input placeholder="09XXXXXXXXX" minLength={11} name="motherContact" type="tel" className={style.motherContactInput} />
                    </label>
                    <label>Occupation:
                        <input name="motherOccupation" type="text" className={style.motherOccupationInput} />
                    </label>
                    <label>Education Attainment:
                        <select name="motherEducAttainment" id="motherEducAttainment" className={style.motherEducAttainmentInput} defaultValue="">
                            <option value="" disabled hidden>Select an option</option>
                            <option value="college">College Graduate</option>
                            <option value="highSchool">High School Graduate</option>
                            <option value="elemSchool">Elementary School Graduate</option>
                            <option value="undergrad">Undergraduate</option>
                        </select>
                    </label>
                </div>

                {/*FATHER INFORMATION*/}

                <div id="step-4" className={style.fatherInfoDiv} hidden={formStep != 4}>
                    <p className={style.header}>FATHER INFORMATION</p>

                    <label>Name:
                        <input name="fatherName" type="text" className={style.fatherNameInput} />
                    </label>
                    <label>Age:
                        <input min={1} name="fatherAge" type="text" className={style.fatherAgeInput} />
                    </label>
                    <label>Address:
                        <input name="fatherAddress" type="text" className={style.fatherAddressInput} />
                    </label>
                    <label>Contact Number:
                        <input minLength={11} placeholder="09XXXXXXXXX" name="fatherContact" type="tel" className={style.fatherContactInput} />
                    </label>
                    <label>Occupation:
                        <input name="fatherOccupation" type="text" className={style.fatherOccupationInput} />
                    </label>
                    <label>Education Attainment:
                        <select name="fatherEducAttainment" id="fatherEducAttainment" className={style.fatherEducAttainmentInput} defaultValue="">
                            <option value="" disabled hidden>Select an option</option>
                            <option value="college">College Graduate</option>
                            <option value="highSchool">High School Graduate</option>
                            <option value="elemSchool">Elementary School Graduate</option>
                            <option value="undergrad">Undergraduate</option>
                        </select>
                    </label>
                </div>

                {/*SIBLINGS INFORMATION */}

                <div id="step-5" className={style.childrenInfoDiv} hidden={formStep != 5}>
                    <p className={style.header}>SIBLINGS INFORMATION</p>
                    {Array.from({ length: dependents }).map((_, index) => (
                        <div className={style.dependentDiv} key={index}>
                            <label>Name:
                                <input name="childrenName" type="text" className={style.childrenNameInput} />
                            </label>
                            <label>Occupation:
                                <select
                                    name="childrenOccupation"
                                    id={`childrenOccupation-${index}`}
                                    className={style.childrenOccupationInput}
                                    value={childrenOccupations[index] || ""}
                                    onChange={(e) => handleChildOccupationChange(index, e.target.value)}
                                >
                                    <option value="" disabled hidden>Select an option</option>
                                    <option value="student">Student</option>
                                    <option value="graduate">Graduate</option>
                                    <option value="employed">Employed</option>
                                    <option value="undergraduate">Undergraduate</option>
                                    <option value="vocational">Vocational</option>
                                    <option value="unemployed">Unemployed</option>
                                    <option value="pwd">PWD</option>
                                    <option value="others">Others</option>
                                </select>
                            </label>
                            <input
                                type="hidden"
                                name="childrenOccupationSpec"
                                value={childrenSpecs[index] || ""}
                            />
                            {childrenOccupations[index] === 'others' && (
                                <label> Please specify:
                                    <input
                                        required
                                        type="text"
                                        value={childrenSpecs[index] || ""}
                                        onChange={(e) => handleChildSpecChange(index, e.target.value)}
                                    />
                                </label>
                            )}
                        </div>
                    ))}

                </div>

                {/*REQUIREMENT FILES*/}

                <div id="step-6" className={style.requirementFilesDiv} hidden={formStep != 6 || isSubmitting}>
                    <p className={style.header}>ADDITIONAL REQUIREMENTS</p>
                    <label>
                        Certificate of Registration/Enrollment:
                        <div className={style.fileInputWrapper}>
                            <input required name="coe" type="file" className={style.coeInput} id="coe" onChange={(e) => handleFileChange(e, "coe")} />
                            <span className={`${style.fileLabel} ${selectedFiles.coe ? style.fileAdded : ""}`}>
                                {selectedFiles.coe ? `✓ ${selectedFiles.coe}` : "Add file"}
                            </span>
                        </div>
                    </label>
                    <label>
                        Certificate of Grades/Report Card:
                        <div className={style.fileInputWrapper}>
                            <input required name="cog" type="file" className={style.cogInput} id="cog" onChange={(e) => handleFileChange(e, "cog")} />
                            <span className={`${style.fileLabel} ${selectedFiles.cog ? style.fileAdded : ""}`}>
                                {selectedFiles.cog ? `✓ ${selectedFiles.cog}` : "Add file"}
                            </span>
                        </div>
                    </label>
                    <label>
                        School ID/Valid ID:
                        <div className={style.fileInputWrapper}>
                            <input required name="validID" type="file" className={style.idInput} id="validID" onChange={(e) => handleFileChange(e, "validID")} />
                            <span className={`${style.fileLabel} ${selectedFiles.validID ? style.fileAdded : ""}`}>
                                {selectedFiles.validID ? `✓ ${selectedFiles.validID}` : "Add file"}
                            </span>
                        </div>
                    </label>
                </div>

                <div className={style.utilButtons}>
                    <button type="button" onClick={handleBack} className={style.backButton} hidden={formStep == 1}>&#9664; Back</button>
                    <button type="button" onClick={handleNext} className={style.nextButton} hidden={formStep == 6} disabled={nameStatus === "record already exists!"}>Next &#9654;</button>
                    <button type="submit" className={style.formSubmitButton} hidden={formStep != 6}>
                        {isSubmitting ? "Uploading submission" : "Submit"}
                    </button>
                </div>

            </form>
        </div >
    )
}