import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {Sm2Page}from "./sm2Page";
import { Sm3Page } from './sm3Page';

import { Sm4Page } from './sm4Page';


export default function CryptoPage() {
    return (
      <Tabs defaultValue="sm2" className="w-full h-full p-10 flex flex-col	" >
      <TabsList className="grid w-1/2 grid-cols-3 flex-initial" >
        <TabsTrigger value="sm2">SM2</TabsTrigger>
        <TabsTrigger value="sm3">SM3</TabsTrigger>
        <TabsTrigger value="sm4">SM4</TabsTrigger>
      </TabsList>
      <TabsContent value="sm2"  className="w-full h-full"><Sm2Page/></TabsContent>
      <TabsContent value="sm3"  className="w-full h-full"><Sm3Page/></TabsContent>
      <TabsContent value="sm4"  className="w-full h-full"><Sm4Page/></TabsContent>

    </Tabs>
    );
}