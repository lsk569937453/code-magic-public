import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {Base64TextPage}from "./base64TextPage";
import { Base64ImagePage } from './base64ImagePage';



export default function Base64Page() {
    return (
      <Tabs defaultValue="text" className="w-full h-full p-10 flex flex-col	" >
      <TabsList className="grid w-1/4 grid-cols-2 flex-initial" >
        <TabsTrigger value="text">文本</TabsTrigger>
        <TabsTrigger value="image">图片</TabsTrigger>
      </TabsList>
      <TabsContent value="text"  className="w-full h-full"><Base64TextPage/></TabsContent>
      <TabsContent value="image"  className="w-full h-full"><Base64ImagePage/></TabsContent>
    </Tabs>
    );
}