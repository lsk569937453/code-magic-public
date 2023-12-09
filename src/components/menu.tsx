"use client"

import { useCallback, useEffect, useState } from "react"
import logo from "@/assets/logo.png"
import { Globe, Mic, Sailboat } from "lucide-react"
// import { WindowTitlebar } from "tauri-controls"

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"

import { AboutDialog } from "./about-dialog"
import { MenuModeToggle } from "./menu-mode-toggle"
import { Dialog, DialogTrigger } from "./ui/dialog"

export function Menu() {

  const [showAboutDialog,setShowAboutDialog]=useState(false);
  const [showPreferenceDialog,setShowPreferenceDialog]=useState(false);

  return (
    <div

    >
      <Menubar className="rounded-none border-b border-none pl-2 lg:pl-3">
        <MenubarMenu>
        
        </MenubarMenu>
        <Dialog open={showAboutDialog} onOpenChange={setShowAboutDialog}>
          <AboutDialog />
        </Dialog>
        <Dialog open={showPreferenceDialog} onOpenChange={setShowPreferenceDialog}>
          <AboutDialog />
        </Dialog>
        <MenubarMenu>
          <MenubarTrigger className="font-bold">App</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={()=>setShowAboutDialog(true)}>About App</MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={()=>setShowAboutDialog(true)}>
              Preferences
            </MenubarItem>
          </MenubarContent>

        </MenubarMenu>




        <MenuModeToggle />
      </Menubar>
    </div>
  )
}
