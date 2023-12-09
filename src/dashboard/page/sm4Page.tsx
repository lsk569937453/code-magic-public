import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

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

    const handleEncryptClick = async () => {
        if (encryptMode === "cbc") {
            if (currentInput === undefined || currentInput === "" || currentKey === undefined || currentKey === "" || currentIV === undefined || currentIV === "") {
                toast({
                    variant: "destructive",
                    title: "错误信息",
                    description: "文本输入、密钥和初始向量不能为空。",
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
                    title: "错误信息",
                    description: response_msg,
                })
            }
        } else if (encryptMode === "ecb") {
            if (currentInput === undefined || currentInput === "" || currentKey === undefined || currentKey === "") {
                toast({
                    variant: "destructive",
                    title: "错误信息",
                    description: "文本输入、密钥不能为空。",
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
                    title: "错误信息",
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
                    title: "错误信息",
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
                    title: "错误信息",
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
                    <Textarea placeholder="请输入需要加密/解密的文本。" className="basis-5/12 mb-5 resize-none border-foreground/50 border" value={currentInput} onChange={handleValueChange} />
                    <Input className="basis-1/12 mb-5" placeholder="秘钥" onChange={handleKeyOnChnage} value={currentKey}></Input>
                    <Input className="basis-1/12 mb-5" placeholder="IV" onChange={handleIVChange} value={currentIV}></Input>
                    <Textarea disabled={true} className="basis-5/12 mb-5 resize-none border-foreground/50 border" value={currentResult} />

                </div>
                <div className="basis-4/12 flex flex-col gap-5">
                    <Card className=" flex flex-col p-5" >
                        <div className="basis-1/12 mb-3 flex flex-row justify-between items-center">
                            <p className="basis-1/2">输入格式:</p>
                            <Select defaultValue={"text"} onValueChange={value => setEncryptInputFormat(value)}>
                                <SelectTrigger className="basis-1/2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hex">Hex编码</SelectItem>
                                    <SelectItem value="base64">Base64编码</SelectItem>
                                    <SelectItem value="text">无编码</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="basis-1/12 mb-3 flex flex-row justify-between items-center">
                            <p className="basis-1/2">输出格式:</p>
                            <Select defaultValue={"hex"} onValueChange={value => setEncryptOutputFormat(value)}>
                                <SelectTrigger className="basis-1/2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="base64">Base64编码</SelectItem>
                                    <SelectItem value="hex">Hex编码</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="basis-1/12 mb-3 flex flex-row justify-between items-center">
                            <p className="basis-1/2">秘钥/IV:</p>
                            <Select defaultValue={"text"} onValueChange={value => setEncryptKeyFormat(value)}>
                                <SelectTrigger className="basis-1/2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="base64">Base64编码</SelectItem>
                                    <SelectItem value="hex">Hex编码</SelectItem>
                                    <SelectItem value="text">无编码</SelectItem>

                                </SelectContent>
                            </Select>
                        </div>
                        <div className="basis-1/12 mb-5 flex flex-row justify-between items-center">
                            <p className="1/2">加密模式:</p>
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
                        <Button className="basis-1/12 w-full" onClick={handleEncryptClick}>加密</Button>
                    </Card>
                    <Card className=" flex flex-col p-5" >
                        <div className="basis-1/12 mb-3 flex flex-row justify-between items-center">
                            <p className="basis-1/2">输入格式:</p>
                            <Select defaultValue={"hex"} onValueChange={value => setDecryptInputFormat(value)}>
                                <SelectTrigger className="basis-1/2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hex">Hex编码</SelectItem>
                                    <SelectItem value="base64">Base64编码</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="basis-1/12 mb-3 flex flex-row justify-between items-center">
                            <p className="basis-1/2">输出格式:</p>
                            <Select defaultValue={"text"} onValueChange={value => setDecryptOutputFormat(value)}>
                                <SelectTrigger className="basis-1/2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="base64">Base64编码</SelectItem>
                                    <SelectItem value="hex">Hex编码</SelectItem>
                                    <SelectItem value="text">无编码</SelectItem>

                                </SelectContent>
                            </Select>
                        </div>
                        <div className="basis-1/12 mb-3 flex flex-row justify-between items-center">
                            <p className="basis-1/2">秘钥/IV:</p>
                            <Select defaultValue={"text"} onValueChange={value => setDecryptKeyFormat(value)}>
                                <SelectTrigger className="basis-1/2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="base64">Base64编码</SelectItem>
                                    <SelectItem value="hex">Hex编码</SelectItem>
                                    <SelectItem value="text">无编码</SelectItem>

                                </SelectContent>
                            </Select>
                        </div>
                        <div className="basis-1/12 mb-5 flex flex-row justify-between items-center">
                            <p className="1/2">解密模式:</p>
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
                        <Button className="basis-1/12 w-full" onClick={handleDecryptClick}>解密</Button>
                    </Card>
                
                </div>
            </div>
        </>


    );
}