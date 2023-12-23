import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation, Trans } from "react-i18next";

export function HalfToFullPage() {
    const [currentInput, setCurrentInput] = useState();
    const { toast } = useToast()
    const { t, i18n } = useTranslation();

    const base64Encode = async () => {
        if (currentInput === undefined || currentInput === "") {
            toast({
                variant: "destructive",
                title: t('toastMessage.errorMessageTile'),
                description: t('halfFullPage.sourceNotEmptyMessageBody'),
            })
            return;
        }
        const { response_code, response_msg } = JSON.parse(await invoke("to_dbc", { sourceString: currentInput }));
        console.log(response_code);
        console.log(response_msg);

        if (response_code === 0) {
            setCurrentInput(response_msg);
        }
    }
    const base64Decode = async () => {
        if (currentInput === undefined || currentInput === "") {
            toast({
                variant: "destructive",
                title: t('toastMessage.errorMessageTile'),
                description:  t('halfFullPage.sourceNotEmptyMessageBody'),
            })
            return;
        }
        const { response_code, response_msg } = JSON.parse(await invoke("to_cdb", { sourceString: currentInput }));
        console.log(response_code);
        console.log(response_msg);

        if (response_code === 0) {
            setCurrentInput(response_msg);
        }
    }
    const handleValueChange = (e: any) => {
        setCurrentInput(e.target.value);
    }
    return (
        <>
            <Textarea placeholder={t('halfFullPage.inputTextPlaceHolder')} className="h-1/2 mb-10 resize-none border-foreground/50 border" value={currentInput} onChange={handleValueChange} />
            <div className="w-full flex gap-10">
                <Button className="flex-1" onClick={base64Encode}>{t('halfFullPage.codeButtonText')}</Button>
                <Button className="flex-1" onClick={base64Decode}>{t('halfFullPage.decodeButtonText')}</Button>
            </div>
        </>

    );
}