import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Api, createAlignPrograms } from "align-sdk";
import { useEffect, useState } from "react";
import { useDecentralizedSocial } from "../hooks/useDecentralizedSocial";

const TreasuryPanel = () => {

    const {organizations, user} = useDecentralizedSocial()
    const {connection} = useConnection()
    const wallet = useWallet()

    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const getTreasuryBalance = async () => {
            if(!organizations || organizations.length === 0){
                return
            }
            const programs = await createAlignPrograms(connection, wallet as any)
            const balance = await Api.fetchNativeTreasuryBalance(organizations[0], programs)
            console.log(balance )

            setBalance(balance / LAMPORTS_PER_SOL)
        }
        getTreasuryBalance()
    }, [wallet, organizations, user]);

    return (
         <div className="bg-black bg-opacity-30 w-full font-light h-24 border border-white rounded-md border-opacity-30 px-5 py-8 flex flex-row items-center justify-between">
            <div>
                Treasury
            </div>
            <div className="flex gap-3 text-sm">
                <div className="border border-white border-solid border-opacity-30 px-3 py-1 rounded-full text-opacity-50">
                        {balance.toFixed(2)} SOL
                </div>
                <div className="border border-white border-solid border-opacity-30 px-3 py-1 rounded-full">
                        1000 USDC
                </div>
            </div>
        </div> 
    );
}
 
export default TreasuryPanel;