import exampleUserBg from "../assets/examples/exampleBanner.jpg";
import exampleAvatar from "../assets/examples/exampleAvatar.png";
import { truncateKey } from "../utils/truncateKey";
import { Clipboard, Edit } from "react-feather";
import { Proposal } from "../components/Proposal";
import slugsLogo from "../assets/examples/slugs.jpg";
import passportsLogo from "../assets/examples/passport.webp";
import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";
import { useDecentralizedSocial } from "../hooks/useDecentralizedSocial";
import LoadingSpinner from "../components/LoadingSpinner";

export const getTokenAccountsByAddress = async (
    addr: string,
    connection: Connection
) => {
    return connection.getParsedTokenAccountsByOwner(new PublicKey(addr), {
        programId: new PublicKey(TOKEN_PROGRAM_ID),
    });
};
export const METADATA_PREFIX = Buffer.from("metadata");
export const METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
export function Profile() {
    const { user, proposals, wallet } = useDecentralizedSocial();

    if (!wallet?.publicKey) {
        return <div />;
    }

    if(!user){
        return (
            <div className="max-w-6xl mx-auto flex items-center justify-center">
                <LoadingSpinner/>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 text-white">
            <div className="flex justify-between items-start gap-6">
                <div className="w-2/5 flex" style={{ height: "66vh" }}>
                    <div className="border border-gray-800 bg-black bg-opacity-60 w-full">
                        <img
                            className="rounded object-cover"
                            src={exampleUserBg}
                            alt="banner"
                            style={{ maxHeight: "18%", width: "100%" }}
                        />
                        <div className="ml-5 -mt-5 flex">
                            <img
                                className="rounded-full h-24"
                                src={exampleAvatar}
                                alt="avatar"
                            />
                            <p className="ml-2 text-xl mt-6">
                                <span className="block">
                                    {user.account.username.slice(1)}
                                </span>
                                <span className="block font-thin text-xs opacity-50">
                                    {user.account.username}
                                </span>
                            </p>
                            <p className="flex grow"></p>
                            <p className="mr-4 text-xl mt-6 text-right align-right items-end justify-end">
                                <span className="block"></span>
                                <span className="block font-thin text-xs opacity-50">
                                    {proposals?.length || 0} Proposal(s)
                                </span>
                            </p>
                        </div>
                        <div className="ml-6 mt-5 text-xs mr-10">
                            <p>{/* */}</p>
                            <p className="mt-5">
                                <strong>Wallet Address:</strong>{" "}
                                {truncateKey(wallet.publicKey.toBase58())}
                                <Clipboard
                                    className="h-4 inline-block cursor-pointer"
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            wallet.publicKey.toBase58()
                                        );
                                    }}
                                />
                            </p>
                            <div className="ml-6 mt-5 mb-8">
                                <button className="rounded-full py-2 px-4 border border-gray-500 bg-transparent text-xs">
                                    Profile Recovery Key{" "}
                                    <Clipboard className="h-4 inline-block" />
                                </button>
                                <button className="rounded-full py-2 ml-4 px-4 border border-gray-500 bg-transparent text-xs">
                                    Edit Profile{" "}
                                    <Edit className="h-4 inline-block" />
                                </button>
                            </div>
                            <hr />
                            <h1 className="text-xl mt-3">Owned Collections</h1>

                            <div className="flex flex-wrap">
                                <div
                                    className="flex  mt-3 border border-gray-500 rounded mr-3"
                                    style={{ maxWidth: "160px" }}
                                >
                                    <div className="w-1/3">
                                        <img
                                            src={slugsLogo}
                                            style={{
                                                height: "100%",
                                                width: "auto",
                                            }}
                                        />
                                    </div>
                                    <div className="w-2/3 pt-5">
                                        <span className="block mx-auto ml-1 text-xs text-clip">
                                            Sol Slugs
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className="flex  mt-3 border border-gray-500 rounded mr-3"
                                    style={{ maxWidth: "160px" }}
                                >
                                    <div className="w-1/3">
                                        <img
                                            src={passportsLogo}
                                            style={{
                                                height: "100%",
                                                width: "auto",
                                            }}
                                        />
                                    </div>
                                    <div className="w-2/3 pt-5">
                                        <span className="block mx-auto ml-1 text-xs  text-clip">
                                            Phase Passports
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="w-3/5 px-4 border border-gray-800 rounded pt-5 pl-6 bg-black bg-opacity-60"
                    style={{ height: "66vh" }}
                >
                    <h1 className="text-3xl mt-4">My Proposals</h1>
                    <hr className="mt-6 opacity-30" />
                    {proposals?.map((prop) => (
                        <Proposal
                            key={prop.address.toBase58()}
                            proposal={prop}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
