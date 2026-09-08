"use client";

import { useState } from "react";

export default function SaveButton(){
    const [saved, setSaved] = useState(false);

    return(
        <button
         onClick={()=> setSaved(!saved)}
         className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-white backdrop-blur-sm transition hover:bg-white hover:text-black"
         >
            {saved ? "♥ Saved" : "♡ Save destination"}
         </button>
    );
}