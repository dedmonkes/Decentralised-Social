import { web3 } from "@project-serum/anchor"
import { ShdwDrive } from "@shadow-drive/sdk"
import { ProposalData } from "./types"
export const isBrowser = typeof window !== "undefined" && !window.process?.hasOwnProperty("type")

export const createShadowAccount = async (name : string, proposalData : ProposalData, drive : ShdwDrive) =>{
    const proposalSize = (Buffer.byteLength(JSON.stringify(proposalData,null, 4)) / 1000) + 1
    const result = await drive.createStorageAccount(name, `${proposalSize}KB`, "v2")
    return result
  }
  
  export const uploadProposalMetadata = async (name : string, proposalData : ProposalData, accountAddress : web3.PublicKey, drive : ShdwDrive) => {
    const dataBuff = Buffer.from(JSON.stringify(proposalData, null, 4))

    let file;
    if(isBrowser){
      file = new File(
        [JSON.stringify(proposalData, null, 4)],
        `${name}.json`,
        {
            type: "application/json",
        }
    );
    }
    else {
      file = {
        name :`${name}.json`,
        file : dataBuff
      }
    
    }

    
    const res = await drive.uploadFile(accountAddress, file, "v2")
    console.log('shadow result', res)
    return res
  }