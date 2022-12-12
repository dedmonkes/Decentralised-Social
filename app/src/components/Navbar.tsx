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
                <div className="max-w-full mx-auto px-10 py-2">
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
                            <div className="pt-5 pb-5">
                                <div className="flex">
                                    <button className="text-white font-mono mt-1 mr-3">
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
                                            className="text-white mr-5 px-5"
                                        >
                                            <User className="inline-block h-4" />{" "}
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
