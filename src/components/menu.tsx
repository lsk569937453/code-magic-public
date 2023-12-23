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
import { PreferenceDialog } from "./preferenceDialog"
import { MenuModeToggle } from "./menu-mode-toggle"
import {LanguageMenu}from "./languageMenu"
import { Dialog, DialogTrigger } from "./ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useTranslation, Trans } from "react-i18next";

export function Menu() {

  const [showAboutDialog,setShowAboutDialog]=useState(false);
  const [showPreferenceDialog,setShowPreferenceDialog]=useState(false);
  const { t, i18n } = useTranslation();

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
          <PreferenceDialog />
        </Dialog>
        <MenubarMenu>
          <MenubarTrigger className="font-bold">{t('toolBar.app.name')}</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={()=>setShowAboutDialog(true)}>{t('toolBar.app.first_item')}</MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={()=>setShowPreferenceDialog(true)}>
            {t('toolBar.app.second_item')}
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenuModeToggle />
        <LanguageMenu/>
      </Menubar>
    </div>
  )
}
