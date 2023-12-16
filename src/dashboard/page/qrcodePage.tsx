import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast"

export default function QrcodePage() {
    const [currentInput, setCurrentInput] = useState();
    const [qrcodeResult, setQrcodeResult] = useState<any>();
    const [exportedFilePath, setExportedFilePath] = useState();
    const [flags,setFlags]=useState(0);
    const { toast } = useToast()

    const inputOnChange = (e: any) => {
        setCurrentInput(e.target.value);
    }
    const buttonOnClick = async () => {
        if (currentInput === undefined || currentInput === "") {
            toast({
                variant: "destructive",
                title: "错误信息",
                description: "请先输入字符串。",
            })
            return;
        }
        const { response_code, response_msg } = JSON.parse(await invoke("get_qrcode", { sourceString: currentInput }));
        console.log(response_msg);

        if (response_code === 0) {
            setQrcodeResult("svg+xml;base64," + response_msg);
        }
        setFlags(0);

    }
    const handleBarcodeButtonClick = async () => {
        if (currentInput === undefined || currentInput === "") {
            toast({
                variant: "destructive",
                title: "错误信息",
                description: "请先输入字符串。",
            })
            return;
        }
        const { response_code, response_msg } = JSON.parse(await invoke("get_barcode", { sourceString: currentInput }));
        console.log(response_msg);
        if (response_code === 0) {
            setQrcodeResult("png;base64," + response_msg);
        }
        setFlags(1);
    }
    const handleExportButtonOnClick = async () => {
        if (flags===0){
            const { response_code, response_msg } = JSON.parse(await invoke("export_qrcode", { sourceString: currentInput }));
            console.log(response_msg);
            if (response_code === 0) {
                setExportedFilePath(response_msg);
            }
        }else{
            const { response_code, response_msg } = JSON.parse(await invoke("export_barcode", { sourceString: currentInput }));
            console.log(response_msg);
            if (response_code === 0) {
                setExportedFilePath(response_msg);
            }
        }
       
    }
    return (
        <>
        <div className="h-1/2 p-10 flex flex-row  gap-1 overflow-auto">
            <div className="flex flex-col basis-1/2 h-full">
                <Textarea className="resize-none basis-11/12 mb-10 border-foreground/50 border" placeholder="请输入文本。" value={currentInput} onChange={inputOnChange}></Textarea>
                <div className="basis-1/12 flex flex-row gap-4" >
                    <Button className="basis-1/2" onClick={buttonOnClick}>生成二维码</Button>
                    <Button className="basis-1/2" onClick={handleBarcodeButtonClick}>生成条形码</Button>
                </div>
            </div>
            {qrcodeResult &&
                <div className="basis-1/2 flex flex-col h-full">
                    <div className="basis-10/12 mb-10 overflow-auto">
                        <img className="h-full w-fit object-fill	" src={`data:image/${qrcodeResult}`} />
                    </div>
                    <Button className="basis-1/12" onClick={handleExportButtonOnClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-primary-foreground" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5" /></svg>
                        <p className="ml-2 font-weight-bold">  导出图片</p></Button>
                    {exportedFilePath && <p className="basis-1/12">导出的文件路径：{exportedFilePath}</p>}
                </div>

            }
        </div>
        <p className="pl-10 pr-10 font-bold text-red-500">条形码默认使用39条形码:包含有：0~9 的数字，大写 A~Z 的英文字母，「+」，「-」，「/」，「%」，「$」，「.」，以及空格符(Space)等，共44组编码。</p>
        </>

    );
}