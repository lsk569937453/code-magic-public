import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input";
import { useTranslation, Trans } from "react-i18next";

export default function TimestampPage() {
    const [currentTimestamp, setCurrentTimestamp] = useState();
    const [inputTimestamp,setInputTimestamp]=useState("");
    const [outputDateTime,setOutputDateTime]=useState();
    const [inputDateTime,setInputDateTime]=useState();
    const [outputTimestamp,setOutputTimestamp]=useState();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const interval = setInterval(() => {
            getCurrentTimestamp();
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    useEffect(()=>{
        getCurrentTimestamp();
    },[]);
    async function getCurrentTimestamp() {
        const { response_code, response_msg } = JSON.parse(await invoke("get_current_timestamp", {}));
        console.log(response_code);

        if (response_code === 0) {
            setCurrentTimestamp(response_msg);
        }
    }
    const convertTimestampToDate =async () => {
        console.log("aaa"+inputTimestamp);
        const { response_code, response_msg } = JSON.parse(await invoke("format_timestamp_to_datetime", {sourceTimestamp:parseInt(inputTimestamp)}));
        console.log(response_code);

        if (response_code === 0) {
            setOutputDateTime(response_msg);
        } 
    }
    const convertDatetimeToTimestamp =async () => {
        console.log("pres");
        const { response_code, response_msg } = JSON.parse(await invoke("format_datetime_to_timestamp", {sourceString:inputDateTime}));
        console.log(response_code);
        console.log("after");

        if (response_code === 0) {
            setOutputTimestamp(response_msg);
        }else{
            console.log(response_msg);
        }
    }
    const inputTimestampOnChange=(e:any)=>{
        setInputTimestamp(e.target.value);
    }
    const inputDateTimeOnChange=(e:any)=>{
        setInputDateTime(e.target.value);
    }
    return (
        <div className="h-1/2 p-10 flex flex-col">
            <div className="mb-4 flex flex-row text-center">
            <p className="basis-2/12 flex justify-center items-center font-bold">{t('timestampPage.currentTimestampText')}</p>
                <Label className="basis-4/12 font-bold text-red-500">{currentTimestamp}</Label>
            </div>
            <div className="flex flex-row gap-4 mb-4">
            <p className="basis-2/12 flex justify-center items-center font-bold">{t('timestampPage.timestampDivText')}</p>
                <Input className="basis-4/12 border-foreground/50 border" placeholder={t('timestampPage.timestampInputHolder')} value={inputTimestamp} onChange={inputTimestampOnChange}></Input>
                <Button className="basis-2/12" onClick={convertTimestampToDate}>{t('timestampPage.timestampButtonText')}</Button>
                <Input className="basis-4/12 border-foreground/50 border" value={outputDateTime}></Input>
            </div>
            <div className="flex flex-row gap-4 ">
                <p className="basis-2/12 flex justify-center items-center font-bold">{t('timestampPage.dateDivText')}</p>
                <Input className="basis-4/12 border-foreground/50 border" placeholder={t('timestampPage.DateInputHolder')} value={inputDateTime} onChange={inputDateTimeOnChange}></Input>
                <Button className="basis-2/12" onClick={convertDatetimeToTimestamp}>{t('timestampPage.timestampButtonText')}</Button>
                <Input className="basis-4/12 border-foreground/50 border" value={outputTimestamp}></Input>
            </div>
        </div>

    );
}