// Simple text-based logo example

import { Sparkles } from "lucide-react";

const Logo = () => (
    <div className="flex items-center">
        <Sparkles className="h-8 w-8 text-rose-400" />
        <span className="ml-2 text-xl font-bold bg-gradient-to-r from-rose-400 to-indigo-400 bg-clip-text text-transparent">
            Nexa Ai
        </span>
    </div>
);


export default Logo;