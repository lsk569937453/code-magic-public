
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
// import { CalendarDateRangePicker } from "@/dashboard/components/date-range-picker"
// import { MainNav } from "@/dashboard/components/main-nav"
// import { Overview } from "@/dashboard/components/overview"
// import { RecentSales } from "@/dashboard/components/recent-sales"
// import { Search } from "@/dashboard/components/search"
// import TeamSwitcher from "@/dashboard/components/team-switcher"
// import { UserNav } from "@/dashboard/components/user-nav"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { invoke } from "@tauri-apps/api/tauri";

import Sidebar from "./components/sidebar"
import { useState, useEffect } from "react"

import Base64TextPage from "./page/base64Page"
import UrlEncodePage from "./page/urlencodePage"
import DigestPage from "./page/digestPage"
import TimestampPage from "./page/timestampPage"
import QrcodePage from "./page/qrcodePage"
import FormatPage from "./page/formatPage"
import ColorPalettePage from "./page/colorPalettePage"
import DiffViewerPage from "./page/diffViewerPage"
import CryptoPage from "./page/cryptoPage"
import { useTranslation, Trans } from "react-i18next";


export default function DashboardPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { t, i18n } = useTranslation();

  const [menulist, setMenulist] = useState<any>([]);
  useEffect(() => {
    loadData();
  }, [])
  const constMenulist = () => {
    return [
      {
        label: "转换工具",
        menuIndex: 0,
        sourceIndex: 0,

        render: <Base64TextPage />

      },
      {
        label: "格式化",
        menuIndex: 1,
        sourceIndex: 1,
        render: <FormatPage />

      }, {
        label: "UrlEncode/UrlDecode",
        menuIndex: 2,
        sourceIndex: 2,

        render: <UrlEncodePage />

      },
      {
        label: "摘要算法(MD5,SHA)",
        menuIndex: 3,
        sourceIndex: 3,

        render: <DigestPage />

      },
      {
        label: " 时间戳",
        menuIndex: 4,
        sourceIndex: 4,
        render: <TimestampPage />

      },
      {
        label: "二维码",
        menuIndex: 5,
        sourceIndex: 5,

        render: <QrcodePage />

      },
      {
        label: "调色器",
        menuIndex: 6,
        sourceIndex: 6,

        render: <ColorPalettePage />

      }, {
        label: "文本对比",
        menuIndex: 7,
        sourceIndex: 7,
        render: <DiffViewerPage />
      }
      , {
        label: "加密算法",
        menuIndex: 8,
        sourceIndex: 8,

        render: <CryptoPage />
      }
    ]
  };
  const loadData = async () => {
    const getMenuConfigReqs = constMenulist().map(item => {
      return {
        menu_index: item.menuIndex,
        source_index: item.sourceIndex
      }
    });
    const { response_code, response_msg } = JSON.parse(await invoke("get_menu_config", { getMenuConfigReqs: getMenuConfigReqs }));

    console.log(response_code);
    console.log("get_menu_config:" + JSON.stringify(response_msg));
    if (response_code == 0) {
      const contacts = new Map<any, any>();
      response_msg.forEach((item: { id: any, menu_index: any, source_index: any }) => {
        const { id, menu_index, source_index } = item;
        contacts.set(source_index, menu_index);
      });

      const newMenulist = constMenulist().map(item => {
        const menu_index = contacts.get(item.sourceIndex);
        return {
          ...item,
          menuIndex: menu_index
        }
      });
      //sort 内部写法
      newMenulist.sort(function (a, b) { //callback
        const { menuIndex: menu_index } = a;
        const { menuIndex: bmenu_index } = b;

        if (menu_index > bmenu_index) { // a b 分别是Arr中的 56 21
          return 1  //返回正数 ，b排列在a之前
        } else {
          return -1 //返回负数 ，a排列在b之前
        }
      })
      console.log("convert to:" + JSON.stringify(newMenulist));

      setMenulist(newMenulist);

    }
  }
  const handleMenuClick = (index: number) => {
    setSelectedIndex(index);
  }
  const renderComponent = (menuIndex: number) => {
    const selectedMenu = menulist.find((item:any) => item.menuIndex === menuIndex);
    return selectedMenu ? selectedMenu.render : null;
  };
  return (
    <>
      <div className="max-h-full grid grid-cols-10 relative h-screen overflow-hidden divide-x divide-foreground/30">
        <Sidebar menuList={menulist} onButtonClick={handleMenuClick} />
        <div className="col-span-8">{renderComponent(selectedIndex)}</div>
      </div>
    </>
  )
}
