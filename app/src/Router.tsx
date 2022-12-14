import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
import { Api, createAlignPrograms } from "align-sdk";
import { Toaster } from "react-hot-toast";

import {
    useAnchorWallet,
    useConnection,
    useWallet,
} from "@solana/wallet-adapter-react";

export function Router() {
    return (<>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/u/:identifier" element={<Profile />} />
        </Routes>
        <Toaster
                position="bottom-left"
                reverseOrder={false}
                toastOptions={{
                    style: {
                        // wordBreak: 'break-all'
                    },
                }}
            />
        </>
    );
}
