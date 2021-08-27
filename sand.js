require('dotenv').config()
const {
    LCDClient,
    MsgExecuteContract,
    MsgInstantiateContract,
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
    URL: "https://tequila-lcd.terra.dev",
    chainID: "tequila-0004",
})
const wallet = terra.wallet(mk)
const fees = new StdFee(500_000, { uusd: 20000000 })

// terra136qygjmsusuutemwe65uwnxg7jfekzyrnzfhj9
// terra19ltv8g7nltj5da4hex3nx3ahd8v9dzmm5kjshv
// testnet contract = terra1fh2je8z4gajnvfm6xd80hqc3cpga0gsl396rls
// ALTERED terra19xvyr7c7j8pnp5r96ymcxnv26a4rgfz0xjjcal
async function sand() {
    const msg1 = new MsgInstantiateContract( mk.accAddress, 7958,
    {
        "name": "altered",
        "symbol": "ALTE",
        "decimals": 6,
        "initial_balances": [
        {
            "address": mk.accAddress,
            "amount": "100000000000000"
        }
    ],
        "rebase": 1624294565,
        "rebase_every": 86400,
        "rebase_damping": 10,
        "rebase_damping_launch": 0,
        "pair_address": "terra156v8s539wtz0sjpn8y8a8lfg8fhmwa7fy22aff"
    }
    , false, true)
    try {
        let tx_play = await wallet.createAndSignTx({
            msgs: [msg1],
            memo: 'Automated!',
            fee: fees
        } );
        let tx = await terra.tx.broadcast(tx_play)
        console.log(tx)
    }catch (e) {
        console.log(e)
    }

}
sand()