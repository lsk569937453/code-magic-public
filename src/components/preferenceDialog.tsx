import { useEffect, useState } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { UpdateIcon } from "@radix-ui/react-icons"
import { invoke } from "@tauri-apps/api/tauri";
import { Separator } from "@/components/ui/separator"

import {
  GithubIcon,
  HomeIcon,
  LinkIcon,
  LucideArrowUpRight,
} from "lucide-react"

import { Icons } from "./icons"
import { Button, buttonVariants } from "./ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { useTranslation, Trans } from "react-i18next";

import { useToast } from "@/components/ui/use-toast"
const delay = (ms: number) => new Promise(
  resolve => setTimeout(resolve, ms)
);
export function PreferenceDialog() {
  const { toast } = useToast()
  const { t, i18n } = useTranslation();

  const handleResetButtonOnClick = async () => {
    const { response_code, response_msg } = JSON.parse(await invoke("reset_menu_index"));
    console.log(response_code);
    console.log(response_msg);
    if (response_code === 0) {
      toast({
        title: "操作信息",
        description: "菜单项已经重置成功。",
      });
      await delay(2000);


      window.location.reload();
    }

  }
  return (
    <DialogContent className="overflow-clip">
      <DialogHeader className="flex items-center text-center">


        <DialogTitle className="flex flex-col items-center">
          Setting
        </DialogTitle>
        <Separator />

        <Button onClick={handleResetButtonOnClick}>    {t('preferenceDialog.resetMenuIndexButtonText')}</Button>

      </DialogHeader>



    </DialogContent>
  )
}
