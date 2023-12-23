import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useTranslation, Trans } from "react-i18next";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
const formatMap=new Map([
    ["hex",0],
    ["base64",1],
    ["text",2]
])

const orderMap=new Map([
    ["cbc",0],
    ["ecb",1],

])
export function Sm4Page() {
    const [currentInput, setCurrentInput] = useState();
    const [currentKey, setCurrentKey] = useState();
    const [currentIV, setCurrentIV] = useState();
    const [currentResult, setCurrentResult] = useState();
    const [encryptMode, setEncryptMode] = useState("cbc");
    const [decryptMode,setDecryptMode] = useState("cbc");
    const [encryptInputFormat, setEncryptInputFormat] = useState("text");
    const [encryptOutputFormat, setEncryptOutputFormat] = useState("hex");
    const [decryptInputFormat, setDecryptInputFormat] = useState("hex");
    const [decryptOutputFormat, setDecryptOutputFormat] = useState("text");
    const [encryptKeyFormat,setEncryptKeyFormat]=useState("text");
    const [decryptKeyFormat,setDecryptKeyFormat]=useState("text");
    const { toast } = useToast()
    const { t, i18n } = useTranslation();

    const handleEncryptClick = async () => {
        if (encryptMode === "cbc") {
            if (currentInput === undefined || currentInput === "" || currentKey === undefined || currentKey === "" || currentIV === undefined || currentIV === "") {
                toast({
                    variant: "destructive",
                    title: t('toastMessage.errorMessageTile'),
                    description:t('encryptToolsPage.sm4Page.sourceAndKeyAndIVNotEmptyMessageBody'),
                })
                return;
            }
            const sm4EncryptRequest={
                input_format:formatMap.get(encryptInputFormat),
                output_format:formatMap.get(encryptOutputFormat),
                sm4_algorithm_type:orderMap.get(encryptMode),
                source_string:currentInput,
                iv:currentIV,
                iv_format:formatMap.get(encryptKeyFormat),
                key:currentKey,
                key_format:formatMap.get(encryptKeyFormat)
            };
            console.log("req:"+JSON.stringify(sm4EncryptRequest));
            const { response_code, response_msg } = JSON.parse(await invoke("sm4_encrypt",{ sm4EncryptRequest: sm4EncryptRequest}));
            console.log(response_code);
            console.log(response_msg);

            if (response_code === 0) {
                setCurrentResult(response_msg);
            } else {
                toast({
                    variant: "destructive",
                    title: t('toastMessage.errorMessageTile'),
                    description: response_msg,
                })
            }
        } else if (encryptMode === "ecb") {
            if (currentInput === undefined || currentInput === "" || currentKey === undefined || currentKey === "") {
                toast({
                    variant: "destructive",
                    title: t('toastMessage.errorMessageTile'),
                    description:t('encryptToolsPage.sm4Page.sourceAndKeyNotEmptyMessageBody'),
                })
                return;
            }
            const sm4EncryptRequest={
                input_format:formatMap.get(encryptInputFormat),
                output_format:formatMap.get(encryptOutputFormat),
                sm4_algorithm_type:orderMap.get(encryptMode),
                source_string:currentInput,
        
                key:currentKey,
                key_format:formatMap.get(encryptKeyFormat)
            };
            const { response_code, response_msg } = JSON.parse(await invoke("sm4_encrypt",{ sm4EncryptRequest: sm4EncryptRequest}));
            console.log(response_code);
            if (response_code === 0) {
                setCurrentResult(response_msg);
            } else {
                toast({
                    variant: "destructive",
                    title: t('toastMessage.errorMessageTile'),
                    description: response_msg,
                })
            }
        }
    }
    const handleDecryptClick = async () => {
        if (encryptMode === "cbc") {
            const sm4EncryptRequest={
                input_format:formatMap.get(decryptInputFormat),
                output_format:formatMap.get(decryptOutputFormat),
                sm4_algorithm_type:orderMap.get(decryptMode),
                source_string:currentInput,
                iv:currentIV,
                iv_format:formatMap.get(decryptKeyFormat),
                key:currentKey,
                key_format:formatMap.get(decryptKeyFormat)
            };
            const { response_code, response_msg } = JSON.parse(await invoke("sm4_decrypt", { sm4EncryptRequest: sm4EncryptRequest}));
            console.log(response_code);
            console.log(response_msg);

            if (response_code === 0) {
                setCurrentResult(response_msg);
            } else {
                toast({
                    variant: "destructive",
                    title: t('toastMessage.errorMessageTile'),
                    description: response_msg,
                })
            }
        } else if (encryptMode === "ecb") {
            const sm4EncryptRequest={
                input_format:formatMap.get(decryptInputFormat),
                output_format:formatMap.get(decryptOutputFormat),
                sm4_algorithm_type:orderMap.get(decryptMode),
                source_string:currentInput,
                key:currentKey,
                key_format:formatMap.get(decryptKeyFormat)
            };
            const { response_code, response_msg } = JSON.parse(await invoke("sm4_decrypt", { sm4EncryptRequest: sm4EncryptRequest}));
            console.log(response_code);
            if (response_code === 0) {
                setCurrentResult(response_msg);
            } else {
                toast({
                    variant: "destructive",
                    title: t('toastMessage.errorMessageTile'),
                    description: response_msg,
                })
            }
        }
    }


    const handleValueChange = (e: any) => {
        setCurrentInput(e.target.value);
    }
    const handleKeyOnChnage = (e: any) => {
        setCurrentKey(e.target.value);
    }
    const handleIVChange = (e: any) => {
        setCurrentIV(e.target.value);
    }
   
    return (
        <>
            <div className="w-full h-full flex flex-row gap-10">
                <div className="basis-8/12 flex flex-col">
                    <Textarea placeholder={t('encryptToolsPage.sm4Page.inputTextPlaceHolder')} className="basis-5/12 mb-5 resize-none border-foreground/50 border" value={currentInput} onChange={handleValueChange} />
                    <Input className="basis-1/12 mb-5" placeholder={t('encryptToolsPage.sm4Page.keyInputTextHolder')} onChange={handleKeyOnChnage} value={currentKey}></Input>
                    <Input className="basis-1/12 mb-5" placeholder={t('encryptToolsPage.sm4Page.ivInputTextHolder')} onChange={handleIVChange} value={currentIV}></Input>
                    <Textarea disabled={true} className="basis-5/12 mb-5 resize-none border-foreground/50 border" value={currentResult} />

                </div>
                <div className="basis-4/12 flex flex-col gap-5">
                    <Card className=" flex flex-col p-5" >
                        <div className="basis-1/12 mb-3 flex flex-row justify-between items-center">
                            <p className="basis-1/2">{t('encryptToolsPage.sm4Page.inputSeletectDivText')}</p>
                            <Select defaultValue={"text"} onValueChange={value => setEncryptInputFormat(value)}>
                                <SelectTrigger className="basis-1/2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hex">{t('encryptToolsPage.sm4Page.hexCodeText')}</SelectItem>
                                    <SelectItem value="base64">{t('encryptToolsPage.sm4Page.base64CodeText')}</SelectItem>
                                    <SelectItem value="text">{t('encryptToolsPage.sm4Page.nocodeText')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="basis-1/12 mb-3 flex flex-row justify-between items-center">
                            <p className="basis-1/2">{t('encryptToolsPage.sm4Page.outputSeletectDivText')}</p>
                            <Select defaultValue={"hex"} onValueChange={value => setEncryptOutputFormat(value)}>
                                <SelectTrigger className="basis-1/2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="base64">{t('encryptToolsPage.sm4Page.base64CodeText')}</SelectItem>
                                    <SelectItem value="hex">{t('encryptToolsPage.sm4Page.hexCodeText')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="basis-1/12 mb-3 flex flex-row justify-between items-center">
                            <p className="basis-1/2">{t('encryptToolsPage.sm4Page.publickKeySeletectDivText')}</p>
                            <Select defaultValue={"text"} onValueChange={value => setEncryptKeyFormat(value)}>
                                <SelectTrigger className="basis-1/2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="base64">{t('encryptToolsPage.sm4Page.base64CodeText')}</SelectItem>
                                    <SelectItem value="hex">{t('encryptToolsPage.sm4Page.hexCodeText')}</SelectItem>
                                    <SelectItem value="text">{t('encryptToolsPage.sm4Page.nocodeText')}</SelectItem>

                                </SelectContent>
                            </Select>
                        </div>
                        <div className="basis-1/12 mb-5 flex flex-row justify-between items-center">
                            <p className="1/2">{t('encryptToolsPage.sm4Page.encryptModeSelectDivText')}</p>
                            <Select defaultValue={"cbc"} onValueChange={value => setEncryptMode(value)}>
                                <SelectTrigger className="basis-1/2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cbc">CBC</SelectItem>
                                    <SelectItem value="ecb">ECB</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className="basis-1/12 w-full" onClick={handleEncryptClick}>{t('encryptToolsPage.sm4Page.encryptButtonText')}</Button>
                    </Card>
                    <Card className=" flex flex-col p-5" >
                        <div className="basis-1/12 mb-3 flex flex-row justify-between items-center">
                            <p className="basis-1/2">{t('encryptToolsPage.sm4Page.inputSeletectDivText')}</p>
                            <Select defaultValue={"hex"} onValueChange={value => setDecryptInputFormat(value)}>
                                <SelectTrigger className="basis-1/2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hex">{t('encryptToolsPage.sm4Page.hexCodeText')}</SelectItem>
                                    <SelectItem value="base64">{t('encryptToolsPage.sm4Page.base64CodeText')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="basis-1/12 mb-3 flex flex-row justify-between items-center">
                            <p className="basis-1/2">{t('encryptToolsPage.sm4Page.outputSeletectDivText')}</p>
                            <Select defaultValue={"text"} onValueChange={value => setDecryptOutputFormat(value)}>
                                <SelectTrigger className="basis-1/2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="base64">{t('encryptToolsPage.sm4Page.base64CodeText')}</SelectItem>
                                    <SelectItem value="hex">{t('encryptToolsPage.sm4Page.hexCodeText')}</SelectItem>
                                    <SelectItem value="text">{t('encryptToolsPage.sm4Page.nocodeText')}</SelectItem>

                                </SelectContent>
                            </Select>
                        </div>
                        <div className="basis-1/12 mb-3 flex flex-row justify-between items-center">
                            <p className="basis-1/2">{t('encryptToolsPage.sm4Page.publickKeySeletectDivText')}</p>
                            <Select defaultValue={"text"} onValueChange={value => setDecryptKeyFormat(value)}>
                                <SelectTrigger className="basis-1/2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="base64">{t('encryptToolsPage.sm4Page.base64CodeText')}</SelectItem>
                                    <SelectItem value="hex">{t('encryptToolsPage.sm4Page.hexCodeText')}</SelectItem>
                                    <SelectItem value="text">{t('encryptToolsPage.sm4Page.nocodeText')}</SelectItem>

                                </SelectContent>
                            </Select>
                        </div>
                        <div className="basis-1/12 mb-5 flex flex-row justify-between items-center">
                            <p className="1/2">{t('encryptToolsPage.sm4Page.encryptModeSelectDivText')}</p>
                            <Select defaultValue={"cbc"} onValueChange={value => setDecryptMode(value)}>
                                <SelectTrigger className="basis-1/2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cbc">CBC</SelectItem>
                                    <SelectItem value="ecb">ECB</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className="basis-1/12 w-full" onClick={handleDecryptClick}>{t('encryptToolsPage.sm4Page.decryptButtonText')}</Button>
                    </Card>
                
                </div>
            </div>
        </>


    );
}