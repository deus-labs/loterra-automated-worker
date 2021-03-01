require('dotenv').config()
const {
    LCDClient,
    MsgExecuteContract,
    MnemonicKey
} = require('@terra-money/terra.js')

const mk = new MnemonicKey({
    mnemonic:
    process.env.MNEMONIC,
});
const terra = new LCDClient({
    URL: process.env.LCD_URL,
    chainID: process.env.CHAIN_ID,
})
const wallet = terra.wallet(mk)
function worker() {

    setInterval(function(){
        const send = new MsgExecuteContract(
            mk.accAddress,
            process.env.LOTERRA_CONTRACT,
            {
                play: {},
            }
        )
        wallet
            .createAndSignTx({
                msgs: [send],
                memo: 'play from automated worker!',
            })
            .then(tx => terra.tx.broadcast(tx))
            .then(result => {
                console.log(`TX hash: ${result.txhash}`);
            }).catch(err => console.log(err));
    }, 60000);
}
worker()