import { useEffect, useState } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { UpdateIcon } from "@radix-ui/react-icons"
import { invoke } from "@tauri-apps/api/tauri";

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

export function AboutDialog() {
  const [updateText, setUpdateText] = useState("")
  const [version, setVersion] = useState("")
  const [name, setName] = useState("")
  const [tauriVersion, setTauriVersion] = useState("")
  const { t, i18n } = useTranslation();

  useEffect(() => {
    loadVersion()
  }, [])
  const loadVersion = async () => {
    const { response_code, response_msg } = JSON.parse(await invoke("get_about_version"));
    console.log(response_code);
    console.log(response_msg);

    if (response_code === 0) {
      setVersion(response_msg);
    }
  }
  return (
    <DialogContent className="overflow-clip pb-2">
      <DialogHeader className="flex items-center text-center">
        {/* <div className="rounded-full bg-background p-[6px] text-slate-600 drop-shadow-none transition duration-1000 hover:text-slate-800 hover:drop-shadow-[0_0px_10px_rgba(0,10,50,0.50)] dark:hover:text-slate-400 ">
          <Icons.logo className="h-12 w-12" />
        </div> */}

        <DialogTitle className="flex flex-col items-center gap-2 pt-2">
          CodeMagic
          <span className="flex gap-1 font-mono text-xs font-medium">
            Version {version}

          </span>
        </DialogTitle>

        <DialogDescription className=" text-foreground">
          {t('aboutDialog.doc')}
        </DialogDescription>

        <span className="text-xs text-gray-400">{updateText}</span>
        <DialogDescription className="flex flex-row"></DialogDescription>
      </DialogHeader>


      <DialogFooter className="flex flex-row items-center border-t pt-2 text-slate-400 ">
        <div className="mr-auto flex flex-row gap-2">
          <HomeIcon
            className="h-5 w-5 cursor-pointer transition hover:text-slate-300"
            onClick={() => open("https://github.com/lsk569937453/code-magic-public")}
          />
          <GithubIcon
            className="h-5 w-5 cursor-pointer transition hover:text-slate-300 "
            onClick={() => open("https://github.com/lsk569937453/code-magic-public")}
          />
        </div>


        <DialogPrimitive.Close
          type="submit"
          className={buttonVariants({ variant: "ghost", className: "h-7" })}
        >
          Close
        </DialogPrimitive.Close>
      </DialogFooter>
    </DialogContent>
  )
}
