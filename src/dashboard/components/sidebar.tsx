import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
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
import React, { useState } from "react";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
interface MenuItem {
    label: string;
    menuIndex: number;
}
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    menuList: MenuItem[];
    onButtonClick: (index: number) => void;
}

const Sidebar = ({ menuList, onButtonClick }: SidebarProps) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const handleButtonClick = (index: number) => {
        onButtonClick(index);
        setSelectedIndex(index);
    }
    const [showDialog, setShowDialog] = useState(false);
    const handleRightClick = (e: any) => {
        setShowDialog(true);
        e.preventDefault()
    }
    return (
        <div className={"pb-12 h-screen flex col-span-2 sticky top-0 overflow-auto"}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        常用工具
                    </h2>
                    <Dialog open={showDialog} onOpenChange={setShowDialog} >
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>更新菜单排列</DialogTitle>
                                <DialogDescription>
                                    This action cannot be undone. Are you sure you want to permanently
                                    delete this file from our servers?
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary" onClick={() => { }}>
                                        Close
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <div className="space-y-1">
                        {(
                            <>
                                {menuList.map((item, index) => (
                                    <div key={index}>
                                        <Button key={item.menuIndex} variant="ghost" className="aria-selected:bg-primary/80 hover:bg-primary/80 w-full justify-start"
                                            // onContextMenu={handleRightClick}
                                            aria-selected={selectedIndex === item.menuIndex}
                                            
                                            onClick={() => handleButtonClick(item.menuIndex)}
                                            >
                                            {item.label}
                                        </Button>

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