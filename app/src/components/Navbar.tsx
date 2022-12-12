import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { User } from "react-feather";
import { useNavigate } from "react-router-dom";

import alignByPhaseLabs from "../assets/alignbyphaselabs.svg";
import { useDecentralizedSocial } from "../hooks/useDecentralizedSocial";

export function Navbar() {
    const { pointsBalance, wallet } = useDecentralizedSocial();
    const navigate = useNavigate();

    return (
        <div>
            <nav>
                <div className="mx-auto max-w-screen-2xl px-4 py-8">
                    <div className="flex justify-between">
                        <div
                            className="flex cursor-pointer"
                            onClick={() => {
                                navigate("/");
                            }}
                        >
                            <img
                                alt="align by phase labs"
                                src={alignByPhaseLabs}
                            ></img>
                        </div>
                        <div className="flex space-x-4">
                            <div className="mt-5 mb-5">
                                <div className="flex">
                                    <button className="mt-1 mr-3 font-mono text-white">
                                        {pointsBalance.toFixed(8)} VP
                                    </button>

                                    {wallet?.publicKey && (
                                        <button
                                            onClick={() => {
                                                navigate(
                                                    "/u/" +
                                                        wallet.publicKey.toBase58()
                                                );
                                            }}
                                            className="mr-5 flex items-center gap-1 px-5 text-white"
                                        >
                                            <User className="inline-block h-5" />{" "}
                                            My Profile
                                        </button>
                                    )}
                                    <WalletMultiButton
                                        className="bg-transparent"
                                        style={{
                                            border: "1px solid #631AFF ",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}
