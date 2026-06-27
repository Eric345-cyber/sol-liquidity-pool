const solanaWeb3 = require('@solana/web3.js');
const fs = require('fs');

const KEY = JSON.parse(fs.readFileSync('deploy-key.json', 'utf8'));
const PROGRAM = fs.readFileSync('target/deploy/token_router.so');

async function deploy() {
    const connection = new solanaWeb3.Connection(
        'https://api.mainnet-beta.solana.com',
        'confirmed'
    );

    const wallet = solanaWeb3.Keypair.fromSecretKey(new Uint8Array(KEY));
    const balance = await connection.getBalance(wallet.publicKey);
    console.log('Balance:', balance / 1000000000, 'SOL');

    const program = solanaWeb3.Keypair.generate();
    const rent = await connection.getMinimumBalanceForRentExemption(PROGRAM.length);
    const tx = new solanaWeb3.Transaction();

    tx.add(
        solanaWeb3.SystemProgram.createAccount({
            fromPubkey: wallet.publicKey,
            newAccountPubkey: program.publicKey,
            lamports: rent,
            space: PROGRAM.length,
            programId: new solanaWeb3.PublicKey('BPFLoaderUpgradeab1e11111111111111111111111'),
        })
    );

    tx.add({
        keys: [
            { pubkey: program.publicKey, isSigner: false, isWritable: true },
        ],
        programId: new solanaWeb3.PublicKey('BPFLoaderUpgradeab1e11111111111111111111111'),
        data: PROGRAM,
    });

    tx.feePayer = wallet.publicKey;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    tx.sign(wallet, program);

    const txid = await connection.sendRawTransaction(tx.serialize());
    await connection.confirmTransaction(txid, 'confirmed');

    console.log('Program ID:', program.publicKey.toString());
    fs.writeFileSync('program-id.txt', program.publicKey.toString());
}

deploy().catch(e => console.error(e.message));
