import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { invoke } from "@tauri-apps/api/tauri";
import { Button } from "@/components/ui/button"
import { SketchPicker,ChromePicker,PhotoshopPicker ,SwatchesPicker  } from "react-color";

export default function ColorPalettePage() {
    const [currentInput, setCurrentInput] = useState();
    const [color, setColor] = useState();
    const handleChange = (color:any) => setColor(color);


    const handleValueChange = (e: any) => {
        setCurrentInput(e.target.value);
    }

    return (<div className="grid grid-cols-3 gap-10 p-10">
          <PhotoshopPicker className="col-span-2" color={color} onChangeComplete={handleChange} />
            <SketchPicker color={color} onChangeComplete={handleChange} />
             <ChromePicker color={color} onChangeComplete={handleChange} />
           
             <SwatchesPicker color={color} onChangeComplete={handleChange} />


    </div>

    );
}