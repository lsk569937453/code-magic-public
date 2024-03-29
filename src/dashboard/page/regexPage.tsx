import { Input } from "@/components/ui/input"
import { useState, useRef, useEffect } from "react"
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
    const [currentRegex, setCurrentRegex] = useState<any>('([A-Z])\\w+');
    const [currentInput, setCurrentInput] = useState("RegExr was created by gskinner.com. Edit the Expression & Text to see matches. Roll over matches or the expression for details. PCRE & JavaScript flavors of RegEx are supported. Validate your expression with Tests mode. The side bar includes a Cheatsheet, full Reference, and Help. You can also Save & Share with the Community and view patterns you create or favorite in My Patterns. Explore results with the Tools below. Replace & List output custom results. Details lists capture groups. Explain describes your expression in plain English.");
    const { toast } = useToast()
    const { setTheme, theme } = useTheme()
    const aceEditorRef = useRef<ReactAce | null>(null);

    useEffect(() => {
        showRegex(currentRegex);
    }, [])

    const showRegex=(v:any)=>{
        console.log("v is :"+v);
        const regex = new RegExp(v, 'gm');
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
    const handleRegexInputOnChange = (t: any) => {
        // const e = require("ace-builds/src-noconflict/ext-searchbox");
        // e.Search(aceEditorRef.current?.editor, true);
        setCurrentRegex(t.target.value);
        showRegex(t.target.value);

    }
    
    const handleValueChange = (e: any) => {
        console.log(e);
        setCurrentInput(e);
    }
    return (
        <>
            <div className="flex flex-col h-[calc(100vh-30px)] gap-4">
                <div >
                    <Input value={currentRegex} placeholder={t('regexPage.regexInputPlaceHolder')} onChange={handleRegexInputOnChange}></Input>
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