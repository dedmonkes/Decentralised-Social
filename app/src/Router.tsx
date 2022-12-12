import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
import { Api, createAlignPrograms } from "@dedmonkes/align-sdk";
import {
    useAnchorWallet,
    useConnection,
    useWallet,
} from "@solana/wallet-adapter-react";

export function Router() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/u/:identifier" element={<Profile />} />
        </Routes>
    );
}
