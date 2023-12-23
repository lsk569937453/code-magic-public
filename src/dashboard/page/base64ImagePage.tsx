import { useState, useEffect } from "react";
import { open } from '@tauri-apps/api/dialog';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Textarea } from "@/components/ui/textarea"
import { convertFileSrc } from '@tauri-apps/api/tauri';

import { invoke } from "@tauri-apps/api/tauri";
import { useToast } from "@/components/ui/use-toast"

import { useTranslation, Trans } from "react-i18next";

export function Base64ImagePage() {
    const [file, setFile] = useState<any>();
    const [text, setText] = useState();
    const [imageStr, setImageStr] = useState<any>();
    const [imageSavePath, setImageSavePath] = useState<any>();
    const { t, i18n } = useTranslation();

    const { toast } = useToast()

    const handleValueChange = (e: any) => {
        setText(e.target.value);
    }
    const buttonClick = async () => {
        const selected = await open({
            multiple: false,
            filters: [{
                name: 'Image',
                extensions: ['png', 'jpeg', "jpg"]
            }]
        });
        if (Array.isArray(selected)) {
        } else if (selected === null) {
        } else {
            setImageStr(convertFileSrc(selected));
            setFile(selected);
            // user selected a single file
        };
        console.log(selected);
    };
    const handleReverseButtonClick = () => {
        if (text === undefined || text === "") {
            toast({
                variant: "destructive",
                title: t('toastMessage.errorMessageTile'),
                description: t('base64ImagePage.base64ShouldNotEmptyMessageBody'),
            })
            return;
        }
        setImageStr("data:image/png;base64," + text);
    }
    const handleConvertButtonClick = async () => {
        if (file === undefined || file === "") {
            toast({
                variant: "destructive",
                title: t('toastMessage.errorMessageTile'),
                description: t('base64ImagePage.imageShouldNotEmptyMessageBody'),
            })
            return;
        }
        const { response_code, response_msg } = JSON.parse(await invoke("base64_encode_of_image", { sourceString: file }));
        console.log(response_code);
        console.log(response_msg);

        if (response_code === 0) {
            setText(response_msg);
        }
    }
    const handleSaveImageButtonClick = async () => {
        if (text === undefined || text === "") {
            toast({
                variant: "destructive",
                title: t('toastMessage.errorMessageTile'),
                description:  t('base64ImagePage.base64ShouldValidMessageBody'),
            })
            return;
        }
        const { response_code, response_msg } = JSON.parse(await invoke("base64_save_image", { sourceString: text }));

        console.log(response_msg);

        if (response_code === 0) {
            setImageSavePath(response_msg);
        }
    }
    const handleCopyButtonClick=()=>{
        navigator.clipboard.writeText(imageSavePath);
    }
    return (
        <div className="h-1/2 flex flex-row gap-4">
            {imageStr ? <img src={imageStr} className="h-full basis-1/2 overflow-auto" /> : <Button onClick={buttonClick} variant="outline" className="h-full basis-1/2 text-3xl border-foreground/50 border">
               {t('base64ImagePage.imageSelectButtonText')}
            </Button>}

            <div className="h-full flex flex-col justify-center gap-4 basis-1/6 ">
                <Button className="basis-1/7 " onClick={handleConvertButtonClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-primary-foreground" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 17l5-5-5-5M6 17l5-5-5-5" /></svg>
                </Button>
                <Button className="basis-1/7" onClick={handleReverseButtonClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-primary-foreground" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
                    </svg>
                </Button>
            </div>
            <div className="h-full basis-1/2 flex flex-col gap-4">
                <Textarea placeholder={t('base64ImagePage.inputTextPlaceHolder')} className="basis-11/12 resize-none border-foreground/50 border" value={text} onChange={handleValueChange} />
                <div className="w-full flex flex-row gap-4">
                    <Button className="basis-4/12" onClick={handleSaveImageButtonClick}> {t('base64ImagePage.downloadButtonText')}</Button>
                    <Input className="basis-6/12" value={imageSavePath}></Input>
                    <Button className="basis-2/12" onClick={handleCopyButtonClick}>{t('base64ImagePage.coppyButtonText')}</Button>

                </div>

            </div>
        </div>
    );
}