import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import FormatJsonPage from "./formatJsonPage";
import FormatYamlPage  from './formatYamlPage';
import FormatXmlPage from "./formatXmlPage"


export default function FormatPage() {
    return (
      <Tabs defaultValue="text" className="w-full h-full p-10 flex flex-col	" >
      <TabsList className="grid w-1/4 grid-cols-3 flex-initial" >
        <TabsTrigger value="text">JSON</TabsTrigger>
        <TabsTrigger value="image">YAML</TabsTrigger>
        <TabsTrigger value="xml">XML</TabsTrigger>

      </TabsList>
      <TabsContent value="text"  className="w-full h-full"><FormatJsonPage/></TabsContent>
      <TabsContent value="image"  className="w-full h-full"><FormatYamlPage/></TabsContent>
      <TabsContent value="xml"  className="w-full h-full"><FormatXmlPage/></TabsContent>

    </Tabs>
    );
}