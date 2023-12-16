import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {Base64TextPage}from "./base64TextPage";
import { Base64ImagePage } from './base64ImagePage';

import { HalfToFullPage } from "./halfFullPage";

export default function Base64Page() {
    return (
      <Tabs defaultValue="text" className="w-full h-full p-10 flex flex-col	" >
      <TabsList className="grid w-1/2 grid-cols-3 flex-initial" >
        <TabsTrigger value="text">Base64文本</TabsTrigger>
        <TabsTrigger value="image">Base64图片</TabsTrigger>
        <TabsTrigger value="halftofull">全角/半角</TabsTrigger>

      </TabsList>
      <TabsContent value="text"  className="w-full h-full"><Base64TextPage/></TabsContent>
      <TabsContent value="image"  className="w-full h-full"><Base64ImagePage/></TabsContent>
      <TabsContent value="halftofull"  className="w-full h-full"><HalfToFullPage/></TabsContent>

    </Tabs>
    );
}