require('dotenv').config()
const {
    LCDClient,
    MsgExecuteContract,
    MnemonicKey
} = require('@terra-money/terra.js')
const axios = require("axios")

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

    setInterval(async function(){
        let _round
        let signature_base64
        let previous_signature_base64
        try {
            let res = await terra.wasm.contractQuery(
                process.env.LOTERRA_CONTRACT,
                {
                    get_round: {},
                },
            );
            const res2 = await axios.get(`https://drand.cloudflare.com/public/${res.next_round}`)
            const {round, signature, previous_signature} = res2.data
            _round = round
            signature_base64 = Buffer.from(signature, 'hex').toString('base64')
            previous_signature_base64 = Buffer.from(previous_signature, 'hex').toString('base64')


        } catch (e) {
            console.log(e)
        }
        const msg = new MsgExecuteContract(mk.accAddress, process.env.TERRAND_CONTRACT, {
            drand:{
                round: _round,
                previous_signature: previous_signature_base64,
                signature: signature_base64
            }
        })
        const msg1 = new MsgExecuteContract(mk.accAddress, process.env.LOTERRA_CONTRACT, {
            play: {}
        })

        wallet
            .createAndSignTx({
                msgs: [msg, msg1],
                memo: 'test from terra.js!',
                fee: new StdFee(7_000_000, { uusd: 2000000 })
            })
            .then(tx => terra.tx.broadcast(tx))
            .then(result => {
                console.log(`TX hash: ${result.txhash}`);
            }).catch(e => console.log(e));
    }, 60000);
}
worker()