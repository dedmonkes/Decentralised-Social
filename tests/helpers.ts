import { Provider, utils, web3 } from "@project-serum/anchor";
import {createCreateMasterEditionV3Instruction, createCreateMetadataAccountV3Instruction, CreateMasterEditionArgs, CreateMasterEditionV3InstructionAccounts, CreateMetadataAccountArgsV2, CreateMetadataAccountArgsV3, CreateMetadataAccountV3InstructionAccounts, PROGRAM_ADDRESS} from "@metaplex-foundation/mpl-token-metadata"
import {createAssociatedTokenAccountInstruction, createInitializeMintInstruction, createMintToCheckedInstruction, getAssociatedTokenAddress, getMinimumBalanceForRentExemptMint, MintLayout, TOKEN_PROGRAM_ID} from "@solana/spl-token"

export const mineIdentifier = () => {
  let iteration = Math.random() * 10000000 ;
  console.log("Mining for prefix idX...")

  while (true) {
    let start = performance.now();
    if (iteration % 10000 == 0) {
      console.log("Iteration :", iteration)
      console.log("Average time per 10000 iterations", (performance.now() - start) / (iteration / 10000))
    }
    const keypair = web3.Keypair.generate()

    if (keypair.publicKey.toBase58().startsWith("id")) {
      console.log("Found key ", keypair.publicKey.toBase58(), keypair.publicKey.toBytes())

      return keypair
    }
    iteration = iteration + 1
  }
}

export const getMetadataAddress = async (mint: web3.PublicKey) => {
    const [address, bump] = await web3.PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("metadata"),
        new web3.PublicKey(PROGRAM_ADDRESS).toBuffer(),
        mint.toBuffer(),
      ],
      new web3.PublicKey(PROGRAM_ADDRESS)
    );
  
    return address;
  };

  export const getMasterEditionAddress = async (mint: web3.PublicKey) => {
    const [address, bump] = await web3.PublicKey.findProgramAddress(
      [
        utils.bytes.utf8.encode("metadata"),
        new web3.PublicKey(PROGRAM_ADDRESS).toBuffer(),
        mint.toBuffer(),
        utils.bytes.utf8.encode("edition"),
      ],
      new web3.PublicKey(PROGRAM_ADDRESS)
    );
  
    return address;
  };
export const getCreateMintIx = async (
    mint: web3.PublicKey,
    authority: web3.PublicKey,
    amount: number,
    decimals: number,
    connection: web3.Connection
  ): Promise<web3.TransactionInstruction[]> => {
    const ata = await getAssociatedTokenAddress(mint, authority);
  
    let instructions = [
      web3.SystemProgram.createAccount({
        fromPubkey: authority,
        newAccountPubkey: mint,
        space: MintLayout.span,
        lamports: await getMinimumBalanceForRentExemptMint(connection),
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        mint, // mint pubkey
        0, // decimals
        authority, // mint authority
        authority // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
      ),
      createAssociatedTokenAccountInstruction(
        authority, // payer
        ata, // ata
        authority, // owner
        mint // mint
      ),
      createMintToCheckedInstruction(mint, ata, authority, amount, decimals),
    ];
  
    return instructions;
  };

export const mintNft = async (
    mint : web3.Keypair,
    provider : Provider
) =>{
    let instructions: web3.TransactionInstruction[] = [];
  const createMintIx = await getCreateMintIx(
    mint.publicKey,
    provider.publicKey,
    1,
    0,
    provider.connection
  );
  const ata = await getAssociatedTokenAddress(
    mint.publicKey,
    provider.publicKey
  );
  const metadataAddress = await getMetadataAddress(mint.publicKey);

  instructions.push(...createMintIx);

  const createMetadataAccounts: CreateMetadataAccountV3InstructionAccounts = {
    metadata: metadataAddress,
    mint: mint.publicKey,
    mintAuthority: provider.publicKey,
    payer: provider.publicKey,
    updateAuthority: provider.publicKey,
  };

  const createMetadataAccountArgs: CreateMetadataAccountArgsV3 = {
    data: {
      name: "name",
      symbol: "DS",
      uri: "https://shdw-drive.genesysgo.net/Avy3TVpFP9M1mjrDFZdswBhdA7kZaJnyiLBPi1XRYqRa/collectionMetadata_49gW2U7ftZ724rMk6bswVayCrTNAu9aGcMiKnSj8XPAG6i5k5pxTtNSUVKZyeWFpn8npz4CVsqzL7CqXfgW33fAM.json",
      sellerFeeBasisPoints: 10000,
      creators: null,
      collection: null,
      uses: null,
    },
    isMutable: false,
    collectionDetails: null,
  };

  const createMetadataAccountsIx = createCreateMetadataAccountV3Instruction(
    createMetadataAccounts,
    {
      createMetadataAccountArgsV3: createMetadataAccountArgs,
    }
  );

  instructions.push(createMetadataAccountsIx);

  const masterEditionAddress = await getMasterEditionAddress(mint.publicKey);

  const createMasterEditionAccounts: CreateMasterEditionV3InstructionAccounts =
    {
      edition: masterEditionAddress,
      mint: mint.publicKey,
      updateAuthority: provider.publicKey,
      mintAuthority: provider.publicKey,
      payer: provider.publicKey,
      metadata: metadataAddress,
    };

  const createMasterEditionArgs: CreateMasterEditionArgs = {
    maxSupply: 0,
  };

  const createMasterEditionAccountsIx = createCreateMasterEditionV3Instruction(
    createMasterEditionAccounts,
    {
      createMasterEditionArgs: createMasterEditionArgs,
    }
  );

  instructions.push(createMasterEditionAccountsIx);

  await provider.sendAndConfirm(new web3.Transaction().add(...instructions), [mint])
}