import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useTranslation, Trans } from "react-i18next";

import { useToast } from "@/components/ui/use-toast"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "recharts";


const formatMap=new Map([
    ["hex",0],
    ["base64",1],
    ["text",2]
])

const orderMap=new Map([
    ["c1c2c3",0],
    ["c1c3c2",1],

])
export function Sm2Page() {
    const [currentInput, setCurrentInput] = useState();
    const [currentPublicKey, setCurrentPublicKey] = useState();
    const [currentPrivateKey, setCurrentPrivateKey] = useState();
    const [currentResult, setCurrentResult] = useState();
    const [encryptInputFormat, setEncryptInputFormat] = useState("text");
    const [encryptOutputFormat, setEncryptOutputFormat] = useState("hex");
    const [encryptOrder,setEncryptOrder]=useState("c1c2c3");
    const [decryptOrder,setDecryptOrder]=useState("c1c2c3");
    const [decryptInputFormat, setDecryptInputFormat] = useState("hex");
    const [decryptOutputFormat, setDecryptOutputFormat] = useState("text");
    const [publicKeyFormat,setPublicKeyFormat]=useState("hex");
    const [privateKeyFormat,setPrivateKeyFormat]=useState("hex");
    const { toast } = useToast()
    const { t, i18n } = useTranslation();

    const handleEncryptClick = async () => {
        if (currentInput === undefined || currentInput === "" || currentPublicKey === undefined || currentPublicKey === "") {
            toast({
                variant: "destructive",
                title: t('toastMessage.errorMessageTile'),
                description:  t('encryptToolsPage.sm2Page.sourceAndPublicKeyNotEmptyMessageBody'),
            })
            return;
        }
        const sm2EncryptRequest={
            input_format:formatMap.get(encryptInputFormat),
            output_format:formatMap.get(encryptOutputFormat),
            algorithm_type:orderMap.get(encryptOrder),
            source_string:currentInput,
            public_key:currentPublicKey,
            public_key_format:formatMap.get(publicKeyFormat)
        };
        const { response_code, response_msg } = JSON.parse(await invoke("sm2_encrypt", { sm2EncryptRequest: sm2EncryptRequest}));
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
    }
    const handleDecryptClick = async () => {
        if (currentInput === undefined || currentInput === "" || currentPrivateKey === undefined || currentPrivateKey === "") {
            toast({
                variant: "destructive",
                title: t('toastMessage.errorMessageTile'),
                description:  t('encryptToolsPage.sm2Page.sourceAndPrivateKeyNotEmptyMessageBody'),
            })
            return;
        }
        const sm2EncryptRequest={
            input_format:formatMap.get(decryptInputFormat),
            output_format:formatMap.get(decryptOutputFormat),
            algorithm_type:orderMap.get(decryptOrder),
            source_string:currentInput,
            private_key:currentPrivateKey,
            private_key_format:formatMap.get(privateKeyFormat)
        };
        console.log("req:"+JSON.stringify(sm2EncryptRequest));
        const { response_code, response_msg } = JSON.parse(await invoke("sm2_decrypt", { sm2EncryptRequest: sm2EncryptRequest}));
   
        console.log(response_code);
        console.log(response_msg);

        if (response_code === 0) {
            setCurrentResult(response_msg);
        } else {
            toast({
                variant: "destructive",
                title: "t('toastMessage.errorMessageTile')",
                description: response_msg,
            })
        }
    }

    const handleGetKeyPairClick = async () => {
        const { response_code, response_msg } = JSON.parse(await invoke("get_sm2_keypair"));
        console.log(response_code);
        console.log(response_msg);

        if (response_code === 0) {
            setCurrentPrivateKey(response_msg[1]);
            setCurrentPublicKey(response_msg[0]);
        }
    }
    const handleValueChange = (e: any) => {
        setCurrentInput(e.target.value);
    }
    const handlePublickKeyChange = (e: any) => {
        setCurrentPublicKey(e.target.value);
    }
    const handlePrivatekKeyChange = (e: any) => {
        setCurrentPrivateKey(e.target.value);
    }
    return (
        <>
            <div className="w-full h-full flex flex-row gap-10">
                <div className="basis-8/12 flex flex-col">
                    <Textarea placeholder= {t('encryptToolsPage.sm2Page.inputTextPlaceHolder')} className="basis-5/12 mb-5 resize-none border-foreground/50 border" value={currentInput} onChange={handleValueChange} />
                    <Input className="basis-1/12 mb-5" placeholder={t('encryptToolsPage.sm2Page.publicKeyInputTextHolder')} onChange={handlePublickKeyChange} value={currentPublicKey}></Input>
                    <Input className="basis-1/12 mb-5" placeholder={t('encryptToolsPage.sm2Page.privateKeyInputTextHolder')} onChange={handlePrivatekKeyChange} value={currentPrivateKey}></Input>
                    <Textarea disabled={true} className="basis-5/12 mb-5 resize-none border-foreground/50 border" value={currentResult} />
                </div>
                <div className="basis-4/12 flex flex-col gap-5">
                    <Button variant={"outline"} onClick={handleGetKeyPairClick}> {t('encryptToolsPage.sm2Page.generatePublicKeyButtonText')}</Button>
                    <Card className=" flex flex-col p-5" >
                        <div className="basis-1/12 mb-3 flex flex-row justify-between items-center">
                            <p className="basis-1/2"> {t('encryptToolsPage.sm2Page.inputSeletectDivText')}</p>
                            <Select defaultValue={"text"} onValueChange={value => setEncryptInputFormat(value)}>
                                <SelectTrigger className="basis-1/2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hex">{t('encryptToolsPage.sm2Page.hexCodeText')}</SelectItem>
                                    <SelectItem value="base64">{t('encryptToolsPage.sm2Page.base64CodeText')}</SelectItem>
                                    <SelectItem value="text">{t('encryptToolsPage.sm2Page.nocodeText')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="basis-1/12 mb-3 flex flex-row justify-between items-center">
                            <p className="basis-1/2"> {t('encryptToolsPage.sm2Page.outputSeletectDivText')}</p>
                            <Select defaultValue={"hex"} onValueChange={value => setEncryptOutputFormat(value)}>
                                <SelectTrigger className="basis-1/2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="base64">{t('encryptToolsPage.sm2Page.base64CodeText')}</SelectItem>
                                    <SelectItem value="hex">{t('encryptToolsPage.sm2Page.hexCodeText')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="basis-1/12 mb-3 flex flex-row justify-between items-center">
                            <p className="basis-1/2">{t('encryptToolsPage.sm2Page.publickKeySeletectDivText')}</p>
                            <Select defaultValue={"hex"} onValueChange={value => setPublicKeyFormat(value)}>
                                <SelectTrigger className="basis-1/2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="base64">{t('encryptToolsPage.sm2Page.base64CodeText')}</SelectItem>
                                    <SelectItem value="hex">{t('encryptToolsPage.sm2Page.hexCodeText')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="basis-1/12 mb-5 flex flex-row justify-between items-center">
                            <p className="1/2">{t('encryptToolsPage.sm2Page.encryptOrderSelectDivText')}</p>
                            <Select defaultValue={"c1c2c3"} onValueChange={value => setEncryptOrder(value)}>
                                <SelectTrigger className="basis-1/2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="c1c2c3">C1C2C3</SelectItem>
                                    <SelectItem value="c1c3c2">C1C3C2</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className="basis-1/12 w-full" onClick={handleEncryptClick}>{t('encryptToolsPage.sm2Page.encryptButtonText')}</Button>
                    </Card>
                    <Card className=" flex flex-col p-5" >
                        <div className="basis-1/12 mb-3 flex flex-row justify-between items-center">
                            <p className="basis-1/2">{t('encryptToolsPage.sm2Page.outputSeletectDivText')}</p>
                            <Select defaultValue={"hex"} onValueChange={value => setDecryptInputFormat(value)}>
                                <SelectTrigger className="basis-1/2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hex">{t('encryptToolsPage.sm2Page.hexCodeText')}</SelectItem>
                                    <SelectItem value="base64">{t('encryptToolsPage.sm2Page.base64CodeText')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="basis-1/12 mb-3 flex flex-row justify-between items-center">
                            <p className="basis-1/2">{t('encryptToolsPage.sm2Page.outputSeletectDivText')}</p>
                            <Select defaultValue={"text"} onValueChange={value => setDecryptOutputFormat(value)}>
                                <SelectTrigger className="basis-1/2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="base64">{t('encryptToolsPage.sm2Page.base64CodeText')}</SelectItem>
                                    <SelectItem value="hex">{t('encryptToolsPage.sm2Page.hexCodeText')}</SelectItem>
                                    <SelectItem value="text">{t('encryptToolsPage.sm2Page.nocodeText')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="basis-1/12 mb-3 flex flex-row justify-between items-center">
                            <p className="basis-1/2">{t('encryptToolsPage.sm2Page.privateKeySeletectDivText')}</p>
                            <Select defaultValue={"hex"} onValueChange={value => setPrivateKeyFormat(value)}>
                                <SelectTrigger className="basis-1/2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="base64">{t('encryptToolsPage.sm2Page.base64CodeText')}</SelectItem>
                                    <SelectItem value="hex">{t('encryptToolsPage.sm2Page.hexCodeText')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="basis-1/12 mb-5 flex flex-row justify-between items-center">
                            <p className="1/2">{t('encryptToolsPage.sm2Page.encryptOrderSelectDivText')}</p>
                            <Select defaultValue={"c1c2c3"} onValueChange={value => setDecryptOrder(value)}>
                                <SelectTrigger className="basis-1/2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="c1c2c3">C1C2C3</SelectItem>
                                    <SelectItem value="c1c3c2">C1C3C2</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className="basis-1/12 w-full" onClick={handleDecryptClick}>{t('encryptToolsPage.sm2Page.decryptButtonText')}</Button>
                    </Card>
                </div>
            </div>
        </>


    );
}