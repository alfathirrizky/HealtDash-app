import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function StatisticPage() {
    return(
        <div className="p-2 h-screen flex items-center justify-center w-full">
            <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">Open popover</Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 bg-blue-600 text-white border-blue-700">
                <div className="grid gap-4">
                <div className="space-y-2">
                    <h4 className="leading-none font-medium text-white">Dimensions</h4>
                    <p className="text-white/80 text-sm">
                    Set the dimensions for the layer.
                    </p>
                </div>

                <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="width" className="text-white">Width</Label>
                    <Input
                        id="width"
                        defaultValue="100%"
                        className="col-span-2 h-8 text-white placeholder-white bg-blue-500/30 border-white/40"
                    />
                    </div>

                    <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="maxWidth" className="text-white">Max. width</Label>
                    <Input
                        id="maxWidth"
                        defaultValue="300px"
                        className="col-span-2 h-8 text-white placeholder-white bg-blue-500/30 border-white/40"
                    />
                    </div>

                    <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="height" className="text-white">Height</Label>
                    <Input
                        id="height"
                        defaultValue="25px"
                        className="col-span-2 h-8 text-white placeholder-white bg-blue-500/30 border-white/40"
                    />
                    </div>

                    <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="maxHeight" className="text-white">Max. height</Label>
                    <Input
                        id="maxHeight"
                        defaultValue="none"
                        className="col-span-2 h-8 text-white placeholder-white bg-blue-500/30 border-white/40"
                    />
                    </div>
                </div>
                </div>
            </PopoverContent>
            </Popover>
        </div>
    );
}

export default StatisticPage;