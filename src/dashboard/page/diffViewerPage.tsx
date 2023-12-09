import { Textarea } from "@/components/ui/textarea"
import { useState, Component } from "react"
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button"
import { ColorPicker, useColor } from "react-color-palette";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import "react-color-palette/css";
import { useToast } from "@/components/ui/use-toast"
import { render } from "react-dom";
import { diff as DiffEditor } from "react-ace";
import "ace-builds/src-noconflict/mode-xml";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-html";

import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-github";
import { useTheme } from "next-themes"

import "ace-builds/src-noconflict/theme-monokai";

import "ace-builds/src-noconflict/ext-language_tools";
export default function DiffViewerPage() {

  const [currentFormat, setCurrentFormat] = useState("html");
  const { toast } = useToast()
  const [differValue, setDifferValue] = useState<any>(["", ""]);
  const { setTheme, theme } = useTheme()

  const handleFormatClick = async () => {
    if (currentFormat === "json") {
      handlFormatPrettyJsonClick();
    } else if (currentFormat === "yaml") {
      handlFormatPrettyYamlClick();
    } else {
      handlFormatPrettyXmlClick();
    }

  }
  const handlFormatPrettyJsonClick = async () => {
    const oldResult = invoke("format_pretty_json", { sourceString: differValue[0] }).then((result: any) => {
      const { response_code, response_msg } = JSON.parse(result);
      if (response_code === 0) {
        let newState = [...differValue];
        newState[0] = response_msg;
        setDifferValue(newState);
      }
    });
    const newResult = invoke("format_pretty_json", { sourceString: differValue[1] }).then((result: any) => {
      const { response_code, response_msg } = JSON.parse(result);
      if (response_code === 0) {
        let newState = [...differValue];
        newState[1] = response_msg;
        setDifferValue(newState);
      }
    });;

    // Begin second call and store promise without waiting
    const finalResult = [await oldResult, await newResult];
  }
  const handlFormatPrettyYamlClick = async () => {
    const oldResult = invoke("format_pretty_yaml", { sourceString: differValue[0] }).then((result: any) => {
      const { response_code, response_msg } = JSON.parse(result);
      if (response_code === 0) {
        let newState = [...differValue];
        newState[0] = response_msg;
        setDifferValue(newState);
      }
    });
    const newResult = invoke("format_pretty_yaml", { sourceString: differValue[1] }).then((result: any) => {
      const { response_code, response_msg } = JSON.parse(result);
      if (response_code === 0) {
        let newState = [...differValue];
        newState[1] = response_msg;
        setDifferValue(newState);
      }
    });;

    // Begin second call and store promise without waiting
    const finalResult = [await oldResult, await newResult];
  }
  const handlFormatPrettyXmlClick = async () => {
    const oldResult = invoke("format_pretty_xml", { sourceString: differValue[0] }).then((result: any) => {
      const { response_code, response_msg } = JSON.parse(result);
      if (response_code === 0) {
        let newState = [...differValue];
        newState[0] = response_msg;
        setDifferValue(newState);
      }
    });
    const newResult = invoke("format_pretty_xml", { sourceString: differValue[1] }).then((result: any) => {
      const { response_code, response_msg } = JSON.parse(result);
      if (response_code === 0) {
        let newState = [...differValue];
        newState[1] = response_msg;
        setDifferValue(newState);
      }
    });;

    // Begin second call and store promise without waiting
    const finalResult = [await oldResult, await newResult];
  }
  const differValueOnChange = (v: any) => {
    console.log(v);
    setDifferValue(v);
  }
  return (<div className="p-10 flex flex-col h-[calc(100vh-30px)]">
    <div className="basis-11/12 mb-10 overflow-auto">
      <DiffEditor

        value={differValue}
        height="1000px"
        width="1000px"
        mode={currentFormat}
        theme={theme === "dark" ? "monokai" : "github"}
        setOptions={{
          useWorker: false
        }}
        onChange={differValueOnChange}
      />
    </div>
    <div className="basis-1/12 flex flex-row gap-4">
      <Select defaultValue={"html"} onValueChange={value => setCurrentFormat(value)}>
        <SelectTrigger className="basis-2/12">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="html">HTML</SelectItem>
          <SelectItem value="json">JSON</SelectItem>
          <SelectItem value="yaml">YAML</SelectItem>
          <SelectItem value="xml">XML</SelectItem>
        </SelectContent>
      </Select>
      <Button className="basis-2/12" variant={"outline"} onClick={handleFormatClick}>格式化</Button>
      {/* <Button className="basis-2/12" onClick={handleShowDiffClick}>{showViewer ? "重新输入" : "开始对比"}</Button> */}


    </div>

  </div>

  );
}