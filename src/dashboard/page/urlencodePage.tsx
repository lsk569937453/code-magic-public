import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation, Trans } from "react-i18next";

export default function UrlEncodePage() {
    const [currentInput, setCurrentInput] = useState();
    const { toast } = useToast()
    const { t, i18n } = useTranslation();

    const urlEncode = async () => {
        if (currentInput === undefined || currentInput === "") {
            toast({
                variant: "destructive",
                title: t('toastMessage.errorMessageTile'),
                description: t('urlEncodePage.sourceNotEmptyMessageBody'),
            })
            return;
        }
        const { response_code, response_msg } = JSON.parse(await invoke("url_encode", { sourceString: currentInput }));
        console.log(response_code);
        console.log(response_msg);

        if (response_code === 0) {
            setCurrentInput(response_msg);
        }
    }
    const urlDecode = async () => {
        if (currentInput === undefined || currentInput === "") {
            toast({
                variant: "destructive",
                title: t('toastMessage.errorMessageTile'),
                description: t('urlEncodePage.sourceNotEmptyMessageBody'),
            })
            return;
        }
        const { response_code, response_msg } = JSON.parse(await invoke("url_decode", { sourceString: currentInput }));
        console.log(response_code);
        console.log(response_msg);

        if (response_code === 0) {
            setCurrentInput(response_msg);
        }
    }
    const handleValueChange = (e: any) => {
        setCurrentInput(e.target.value);
    }
    return (<div className="p-10 flex flex-col h-[calc(100vh-30px)]">
        <div className="basis-1/2 mb-10">
            <Textarea placeholder={t('urlEncodePage.inputTextPlaceHolder')} className="h-full w-full mb-10 border-foreground/50 border" value={currentInput} onChange={handleValueChange} />
        </div>
        <div className="w-full flex gap-10">
            <Button className="flex-1" onClick={urlEncode}>{t('urlEncodePage.codeButtonText')}</Button>
            <Button className="flex-1" onClick={urlDecode}>{t('urlEncodePage.decodeButtonText')}</Button>
        </div>
    </div>

    );
}