import { Input } from "@/components/ui/input"
import { useState, useRef } from "react"
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation, Trans } from "react-i18next";
import AceEditor from "react-ace";
import ReactAce from 'react-ace';
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-kuroir";

import "ace-builds/src-noconflict/ext-searchbox";

import { useTheme } from "next-themes"



export function RegexPage() {
    const { t, i18n } = useTranslation();
    const [currentRegex, setCurrentRegex] = useState<any>();
    const [currentInput, setCurrentInput] = useState();
    const { toast } = useToast()
    const { setTheme, theme } = useTheme()
    const aceEditorRef = useRef<ReactAce | null>(null);


    const handleRegexInputOnChange = (t: any) => {
        // const e = require("ace-builds/src-noconflict/ext-searchbox");
        // e.Search(aceEditorRef.current?.editor, true);
        setCurrentRegex(t.target.value);
        console.log("t is:",t);
        // const regex = new RegExp('([A-Z])\\w+', 'gm');
        // const regex2 = /([A-Z])\w+/gm;
        const regex = new RegExp(t.target.value, 'gm');
        // regexpX.test(:'RegExr was created by gskinner.com');
        console.log(aceEditorRef.current);
        // aceEditorRef.current?.editor.findAll(regexp,{

        //     regExp: true
        // });
        aceEditorRef.current?.editor.$search.setOptions({
            needle: regex,
            caseSensitive: true,
            wholeWord: true,
            regExp: true
        });

    
        const prevMarkers = aceEditorRef.current?.editor.session.getMarkers();
        if (prevMarkers) {
            const prevMarkersArr :any= Object.keys(prevMarkers);
            for (let item of prevMarkersArr) {
                aceEditorRef.current?.editor.session.removeMarker(prevMarkers[item].id);
            }
        }
        var searchDatas = aceEditorRef.current?.editor.$search.findAll(aceEditorRef.current?.editor.session)
        console.log(searchDatas.length, JSON.stringify(searchDatas));
        searchDatas.forEach((element: any) => {
            aceEditorRef.current?.editor.getSession().addMarker(element, "searchMarker", "text");

        });

    }
    
    const handleValueChange = (e: any) => {
        console.log(e);
        setCurrentInput(e);
    }
    return (
        <>
            <div className="flex flex-col h-[calc(100vh-30px)] gap-4">
                <div >
                    <Input placeholder={t('regexPage.regexInputPlaceHolder')} onChange={handleRegexInputOnChange}></Input>
                </div>
                <div className="basis-8/12">

                    <AceEditor
                        ref={aceEditorRef}

                        className="border-foreground/50 border rounded"
                        width="100%"
                        height="100%"
                        placeholder={t('regexPage.testInputPlaceHolder')}
                        mode="html"
                        theme={theme === "dark" ? "monokai" : "github"}
                        name="blah2"
                        value={currentInput} onChange={handleValueChange}
                        fontSize={16}
                        editorProps={{ $blockScrolling: true }}
                        wrapEnabled={true}
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

            </div>
        </>

    );
}