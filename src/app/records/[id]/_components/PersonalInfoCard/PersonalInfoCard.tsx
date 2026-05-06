import style from "./PersonalInfoCard.module.css";

interface PersonalInfo {
    name: string,
    religion: string,
    bday: string,
    contact: string,
    email: string,
    address: string,
    age: string,
    sex: string,
    citizenship: string,
    maritalStatus: string
}

interface PersonalInfoProps {
    personalData: PersonalInfo
}

export default function PersonalInfoCard({ personalData }: PersonalInfoProps) {

    const { name, religion, bday, contact, email, address, age, sex, citizenship, maritalStatus } = personalData;
    const ageGender = `${age || ""}${age && sex ? "/" : ""}${sex || ""}`;

    return (
        <>
            <p>Personal Info</p>
            <div className={style.detailsDiv}>
                <div>
                    <p>FULL NAME</p>
                    <p>{name || "N/A"}</p>
                </div>
                <div>
                    <p>AGE/GENDER</p>
                    <p>{ageGender || "N/A"}</p>
                </div>
                <div>
                    <p>RELIGION</p>
                    <p>{religion || "N/A"}</p>
                </div>
                <div>
                    <p>CITIZENSHIP</p>
                    <p>{citizenship || "N/A"}</p>
                </div>
                <div>
                    <p>BIRTHDATE</p>
                    <p>{bday || "N/A"}</p>
                </div>
                <div>
                    <p>MARITAL STATUS</p>
                    <p>{maritalStatus || "N/A"}</p>
                </div>
                <div>
                    <p>CONTACT</p>
                    <p>{contact || "N/A"}</p>
                </div>
                <div>
                    <p>EMAIL</p>
                    <p>{email || "N/A"}</p>
                </div>
                <div>
                    <p>ADDRESS</p>
                    <p>{address || "N/A"}</p>
                </div>
            </div>
        </>
    )
}