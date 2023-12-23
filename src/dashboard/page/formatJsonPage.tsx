import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import AceEditor from "react-ace";
import { useTheme } from "next-themes"
import { useToast } from "@/components/ui/use-toast"

import "ace-builds/src-noconflict/snippets/xml";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";

import "ace-builds/src-noconflict/theme-monokai";

import "ace-builds/src-noconflict/ext-language_tools";
import { useTranslation, Trans } from "react-i18next";

export default function FormatJsonPage() {
    const [currentInput, setCurrentInput] = useState();
    const [validJson, setValidJson] = useState<object|null>(null);
    const { setTheme, theme } = useTheme()
    const { toast } = useToast()
    const { t, i18n } = useTranslation();

    const formatPrettyJson = async () => {
        if (currentInput === undefined || currentInput === "") {
            toast({
                variant: "destructive",
                title: t('toastMessage.errorMessageTile'),
                description: t('jsonFormatPage.sourceNotEmptyMessageBody'),
            })
            return;
        }
        const { response_code, response_msg } = JSON.parse(await invoke("format_pretty_json", { sourceString: currentInput }));
        console.log(response_code);
     
        if (response_code === 0) {
            setCurrentInput(response_msg);
            let json = JSON.parse(response_msg);
            setValidJson(json);

        }else{
            toast({
                variant: "destructive",
                title: t('toastMessage.errorMessageTile'),
                description: t('jsonFormatPage.sourceNotValidMessageBody'),
            })
        }
    }

    const handleValueChange = (e: any) => {
        setCurrentInput(e);
    }
 
    return (
        <div className="flex flex-col h-[calc(100vh-30px)]">
             <div className="basis-8/12  mb-10">
                {/* <Textarea placeholder="请输入需要格式化的文本。" className="h-full overflow-auto border-foreground/50 border" value={currentInput} onChange={handleValueChange} /> */}
                <AceEditor
                    className="border-foreground/50 border rounded"
                    width="100%"
                    height="100%"
                    placeholder={t('formatToolsPage.formatInputPlaceHolder')}
                    mode="json"
                    theme={theme==="dark"?"monokai":"github"}
                    name="blah2"
                    value={currentInput} onChange={handleValueChange}
                    fontSize={16}
                    editorProps={{ $blockScrolling: true }}

                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    setOptions={{
                        enableBasicAutocompletion: false,
                        enableLiveAutocompletion: false,
                        enableSnippets: false,
                        showLineNumbers: true,
                        tabSize: 2,
                        useWorker: false 
                        }}

                />
            </div>
            <div className="1/12 mb-10">
                    <Button className="w-full" onClick={formatPrettyJson}>{t('formatToolsPage.buttonText')}</Button>
                </div>
            {/* {validJson&&<>
            <p className="mb-2 font-bold text-red-500">json的树形结构为:</p>
            <div className="basis-1/3 overflow-y-auto ">
                <ReactJson src={validJson} theme={"monokai"}/>
            </div>
            </>} */}

        </div>
    );
}