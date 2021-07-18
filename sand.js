require('dotenv').config()
const {
    LCDClient,
    MsgExecuteContract,
    MnemonicKey,
    StdFee,
    Coin,
    MsgGrantAuthorization
} = require('@terra-money/terra.js')
const mk = new MnemonicKey({
    mnemonic:
    process.env.MNEMONIC,
});
/*
{
    "name": "bombay",
    "chainID": "bombay-0007",
    "lcd": "https://bombay-lcd.terra.dev",
    "fcd": "https://bombay-fcd.terra.dev"
}*/
const terra = new LCDClient({
    URL: "https://bombay-lcd.terra.dev",
    chainID: "bombay-0007",
})
const wallet = terra.wallet(mk)
const fees = new StdFee(1_000_000, { uusd: 200000 })

// terra136qygjmsusuutemwe65uwnxg7jfekzyrnzfhj9
// terra19ltv8g7nltj5da4hex3nx3ahd8v9dzmm5kjshv
async function sand() {
    const msg1 = new MsgExecuteContract(mk.accAddress, "terra1hmyfk8dvg40vfd5a0auxjjn7p64dpgnze40zes", {
        poll: {
            description: "Trying poll for the fun your feedback is highly appreciated",
            proposal: "PrizesPerRanks",
            contract_address: "terra1tqgt7957h76fjvjp4s3yj3g937lcuzp6z2gl7m"
        }
    }, {"uusd": "1000000"})
    //let msg1 = new MsgGrantAuthorization(undefined, undefined, undefined, undefined)
    try {
        let tx_play = await wallet.createAndSignTx({
            msgs: [msg1],
            memo: 'Automated worker play!',
            gasPrices: fees.gasPrices(),
            gasAdjustment: 1.5,
        } );
        await terra.tx.broadcast(tx_play)
    }catch (e) {
        console.log(e)
    }

}
sand()