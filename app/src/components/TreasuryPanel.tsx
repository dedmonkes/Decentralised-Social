import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Api, createAlignPrograms } from "@dedmonkes/align-sdk";
import { useEffect, useState } from "react";
import { useDecentralizedSocial } from "../hooks/useDecentralizedSocial";
import { web3 } from "@project-serum/anchor";

const TreasuryPanel = () => {
    const { organizations, user } = useDecentralizedSocial();
    const { connection } = useConnection();
    const wallet = useWallet();

    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const getTreasuryBalance = async () => {
            if (!organizations || organizations.length === 0) {
                return;
            }
            const programs = await createAlignPrograms(
                connection,
                wallet as any,
                new web3.Connection(process.env.REACT_APP_SHADOW_RPC!)
            );
            const balance = await Api.fetchNativeTreasuryBalance(
                organizations[0],
                programs
            );
            console.log(balance);

            setBalance(balance / LAMPORTS_PER_SOL);
        };
        getTreasuryBalance();
    }, [wallet, organizations, user]);

    return (
        <div className="box-container mb-4 py-4 px-6">
            <div className="flex items-center justify-between text-lg">
                <h4>Treasury:</h4>
                <div className="flex items-center justify-end gap-2">
                    <span className="rounded-full border border-white border-opacity-30 px-5 py-1">
                        {balance} SOL
                    </span>
                    <span className="rounded-full border border-white border-opacity-30 px-5 py-1">
                        2,520 USDC
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TreasuryPanel;
