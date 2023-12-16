import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
export function HalfToFullPage() {
    const [currentInput, setCurrentInput] = useState();
    const { toast } = useToast()

    const base64Encode = async () => {
        if (currentInput === undefined || currentInput === "") {
            toast({
                variant: "destructive",
                title: "错误信息",
                description: "请输入需要转换的文本。",
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
                title: "错误信息",
                description: "请输入需要转换的文本。",
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
            <Textarea placeholder="请输入需要转换的文本。" className="h-1/2 mb-10 resize-none border-foreground/50 border" value={currentInput} onChange={handleValueChange} />
            <div className="w-full flex gap-10">
                <Button className="flex-1" onClick={base64Encode}>半角转全角</Button>
                <Button className="flex-1" onClick={base64Decode}>全角转半角</Button>
            </div>
        </>

    );
}