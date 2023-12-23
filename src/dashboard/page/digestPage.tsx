import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { open } from '@tauri-apps/api/dialog';
import { useToast } from "@/components/ui/use-toast"
import { useTranslation, Trans } from "react-i18next";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function DigestPage() {
    const [currentInput, setCurrentInput] = useState();
    const [md5Result, setMd5Result] = useState();
    const [selectedFilePaths, setSelectedFilePaths] = useState<Array<string>>([]);
    const [digestResult, setDigestResult] = useState([]);
    const { toast } = useToast()
    const { t, i18n } = useTranslation();

    const handleValueChange = (e: any) => {
        setCurrentInput(e.target.value);
    }
    const calculateDigest = async () => {
        if ((currentInput === undefined || currentInput === "")&&(selectedFilePaths === null || selectedFilePaths === undefined || selectedFilePaths.length === 0)) {
            toast({
                variant: "destructive",
                title: t('toastMessage.errorMessageTile'),
                description: t('messageDigestPage.sourceNotEmptyMessageBody'),
            })
            return;
        }
        let req: any = {};
        if (currentInput !== null && currentInput !== undefined && currentInput !== "") {
            req.sourceStringOption = currentInput;
        }
        if (selectedFilePaths !== null && selectedFilePaths !== undefined && selectedFilePaths.length !== 0) {
            req.fileListOption = selectedFilePaths;
        }
        console.log("req:" + JSON.stringify(req));
        const { response_code, response_msg } = JSON.parse(await invoke("digest_all", req));
        console.log(response_code);
        console.log(response_msg);

        if (response_code === 0) {
           const {text_md5,text_sha256,file_md5_list}=response_msg;
           const resArray:any=[];
           if (currentInput !== null && currentInput !== undefined && currentInput !== "") {
            resArray.push({"file_path":"文本","md5":text_md5,"sha256":text_sha256});
           }
           if (file_md5_list !== null && file_md5_list !== undefined && file_md5_list.length !== 0) {
             file_md5_list.map((item:any)=>{
                resArray.push({"file_path":item.file_name,"md5":item.text_md5,"sha256":item.text_sha256});
            });
           }
           setDigestResult(resArray);
        }
    }
    const handleSelectFileButtonClick = async () => {
        const selected = await open({
            multiple: true,

        });
        if (selected === null || selected === undefined) {
            return;
        }
        console.log(selected);

        setSelectedFilePaths((prevState: any) => [...prevState, ...selected])
    }

    const renderFileList = () => {
        return selectedFilePaths.map((item, index) => {
            return <li key={index}>{item}</li>
        });
    }
    const renderTable = () => {
        return digestResult.map((item:any, index) => {
            return <TableRow>
                <TableCell className="font-medium">{item.file_path}</TableCell>
                <TableCell>{item.md5} </TableCell>
                <TableCell>{item.sha256} </TableCell>
            </TableRow>
        });
    }
    return (
        <div className=" w-full h-[calc(100vh-30px)] flex flex-col">
            <div className="basis-5/12 p-10 flex flex-row   gap-4 overflow-auto">
                <Textarea placeholder={t('messageDigestPage.md5InputTextHolder')} className="h-full  basis-5/12 resize-none border-foreground/50 border" value={currentInput} onChange={handleValueChange} />
                <div className="basis-1 flex flex-col justify-center h-full">
                    <h2 >{t('messageDigestPage.orText')}</h2>
                </div>
                <div className="h-full overflow-auto flex flex-col basis-1/2 p-1 rounded">
                    <Label className="basis-1/12 mb-2 font-bold">{t('messageDigestPage.selectedShowText')}:{selectedFilePaths.length}</Label>
                    <ol className="basis-4/5 outline outline-1 rounded   bg-card mb-2 p-2 overflow-auto list-decimal list-inside">
                        {renderFileList()}
                    </ol>
                    <Button className="basis-1/12 w-full" onClick={handleSelectFileButtonClick} variant="outline">{t('messageDigestPage.selectButtonText')}</Button>

                </div>
            </div>

            <div className="basis-1/12 w-full  flex flex-col px-10 mb-10">
                <Label className="font-bold mb-1 text-red-500">{t('messageDigestPage.tipsText')}</Label>
                <Button className="flex-1" onClick={calculateDigest}>{t('messageDigestPage.calculateButtonText')}</Button>
            </div>
            <div className="basis-1/2 p-4 overflow-auto px-10 mb-10">
                <Table>
                    <TableCaption>执行结果</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[160px]">{t('messageDigestPage.tableTitles.first')}</TableHead>
                            <TableHead className="w-[60px]">{t('messageDigestPage.tableTitles.second')}</TableHead>
                            <TableHead className="w-[60px]">{t('messageDigestPage.tableTitles.third')}</TableHead>
                        </TableRow>

                    </TableHeader>
                    <TableBody>
                        
                        {renderTable()}
                    </TableBody>
                </Table>
            </div>
        </div>


    );
}