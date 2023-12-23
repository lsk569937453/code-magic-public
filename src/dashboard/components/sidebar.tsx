import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { invoke } from "@tauri-apps/api/tauri";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import React, { useEffect, useState } from "react";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation, Trans } from "react-i18next";

interface MenuItem {
    label: string;
    menuIndex: number;
    sourceIndex: number;
}
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    menuList: MenuItem[];
    onButtonClick: (index: number) => void;
}

const Sidebar = ({ menuList, onButtonClick }: SidebarProps) => {
    const [currentMenuList, setCurrentMenuList] = useState<any>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [clickedSourceIndex, setClickedSourceIndex] = useState(0);
    const [changedMenuIndex, setChangedMenuIndex] = useState("");
    const { t, i18n } = useTranslation();

    const { toast } = useToast()

    useEffect(() => {
        setCurrentMenuList(menuList);
    }, [menuList]);
    const handleButtonClick = (index: number) => {
        onButtonClick(index);
        setSelectedIndex(index);
    }
    const [showDialog, setShowDialog] = useState(false);
    const handleRightClick = async (e: any, index: number) => {
        setClickedSourceIndex(index);
        const aa = menuList.filter(item => item.sourceIndex === index)[0].menuIndex;
        console.log("aa is :" + aa.toString)
        setChangedMenuIndex(aa.toString());
        setShowDialog(true);
        e.preventDefault()
    }
    const handleChangeMenuIndexClick = async () => {
        const sourceMenuIndex = menuList.filter(item => item.sourceIndex === clickedSourceIndex)[0].menuIndex;
        if (sourceMenuIndex == parseInt(changedMenuIndex)) {
            toast({
                variant: "destructive",
                title: "错误信息",
                description: "修改后的菜单号和修改前的一样！",
            })
            return;
        }

        const { response_code, response_msg } = JSON.parse(await invoke("set_menu_index", { sourceIndex: clickedSourceIndex, dstMenuIndex: parseInt(changedMenuIndex) }));
        console.log(response_code);
        console.log(response_msg);
        setShowDialog(false);

        if (response_code === 0) {
            window.location.reload();

        }

    }

    return (
        <div className={"pb-12 h-screen flex col-span-2 sticky top-0 overflow-auto"}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        {t("menu.title")}
                    </h2>
                    <Dialog open={showDialog} onOpenChange={setShowDialog} >
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>更新菜单序号</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="menuIndex" className="text-left">  
                                        菜单序号
                                    </Label>
                                    <Select value={changedMenuIndex} defaultValue={changedMenuIndex} onValueChange={value => setChangedMenuIndex(value)}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select a fruit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {menuList.map((item, index) => (
                                                    <SelectItem key={index} value={item.menuIndex.toString()}>
                                                        {item.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <div className="col-span-4 text-red-500 text-xs">** 如果当前是2号菜单与7号菜单项交换,则2号变为7号菜单,3,4,5,6号菜单变为2,3,4,5号菜单</div>
                                </div>
                            </div>

                            <DialogFooter >
                                <Button type="submit" onClick={handleChangeMenuIndexClick}>保存修改</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <div className="space-y-1">
                        {(
                            <>
                                {menuList.map((item, index) => (
                                    <div key={index}>
                                        <Button key={item.menuIndex} variant="ghost" className="aria-selected:bg-primary/80 hover:bg-primary/80 w-full justify-start"
                                            onContextMenu={(e) => handleRightClick(e, item.sourceIndex)}
                                            aria-selected={selectedIndex === item.menuIndex}

                                            onClick={() => handleButtonClick(item.menuIndex)}
                                        >
                                            {t("menu." + item.sourceIndex)}                                        </Button>

                                    </div>

                                ))}
                            </>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}
export default Sidebar;