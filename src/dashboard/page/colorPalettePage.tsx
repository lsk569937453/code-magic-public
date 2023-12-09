import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button"
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";

export default function ColorPalettePage() {
    const [currentInput, setCurrentInput] = useState();
    const [color, setColor] = useColor("cyan");

    const urlEncode = async () => {
        const { response_code, response_msg } = JSON.parse(await invoke("url_encode", { sourceString: currentInput }));
        console.log(response_code);
        console.log(response_msg);

        if (response_code === 0) {
            setCurrentInput(response_msg);
        }
    }
    const urlDecode = async () => {
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
        <div className="basis-11/12 mb-10 custom-layout">
            <ColorPicker height={500} color={color} onChange={setColor}></ColorPicker>
        </div>

    </div>

    );
}