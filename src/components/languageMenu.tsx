"use client"

import * as React from "react"
import { LaptopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MenubarContent,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Icons } from "@/components/icons"
import { useTranslation, Trans } from "react-i18next";

export function LanguageMenu() {
  const { t, i18n } = useTranslation();

  return (
    <MenubarMenu>
      <MenubarTrigger>{t('toolBar.language.name')}</MenubarTrigger>
      <MenubarContent forceMount>
        <MenubarRadioGroup value={i18n.language}>
          <MenubarRadioItem value="en" onClick={() =>i18n.changeLanguage("en")}>
            <span>{t('toolBar.language.english')}</span>
          </MenubarRadioItem>
          <MenubarRadioItem value="zh" onClick={() => i18n.changeLanguage("zh")}>
            <span>{t('toolBar.language.chinese')}</span>
          </MenubarRadioItem>
        </MenubarRadioGroup>
      </MenubarContent>
    </MenubarMenu>
  )
}
