
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
import Sidebar from "./components/sidebar"
import { useState } from "react"

import Base64TextPage from "./page/base64Page"
import UrlEncodePage from "./page/urlencodePage"
import DigestPage  from "./page/digestPage"
import TimestampPage from "./page/timestampPage"
import QrcodePage from "./page/qrcodePage"
import FormatPage from "./page/formatPage"
import ColorPalettePage from "./page/colorPalettePage"
import DiffViewerPage from "./page/diffViewerPage"
import  CryptoPage from "./page/cryptoPage"
export default function DashboardPage() {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const menulist = [
    {
      label: "Base64转码/解码",
      menuIndex: 1,
      sourceIndex: 1,

      render: <Base64TextPage />

    },
    {
      label: "格式化",
      menuIndex: 2,
      sourceIndex:2,
      render: <FormatPage />

    }, {
      label: "UrlEncode/UrlDecode",
      menuIndex: 3,
      sourceIndex:3,

      render:<UrlEncodePage/>

    },
    {
      label: "摘要算法(MD5,SHA)",
      menuIndex: 4,
      sourceIndex:4,

      render:<DigestPage/>

    },
    {
      label: " 时间戳",
      menuIndex: 5,
      sourceIndex:5,
      render:<TimestampPage/>

    },
    {
      label: "二维码",
      menuIndex: 6,
      sourceIndex:6,

      render:<QrcodePage/>

    },
    {
      label: "调色器",
      menuIndex: 7,
      sourceIndex:7,

      render:<ColorPalettePage/>

    },{
      label: "文本对比",
      menuIndex: 8,
      sourceIndex:8,
      render:<DiffViewerPage/>
    }
    ,{
      label: "加密算法",
      menuIndex: 9,
      sourceIndex:9,

      render:<CryptoPage/>
    }
  ];
  const handleMenuClick = (index: number) => {
    setSelectedIndex(index);
  }
  const renderComponent = (menuIndex: number) => {
    const selectedMenu = menulist.find(item => item.menuIndex === menuIndex);
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
