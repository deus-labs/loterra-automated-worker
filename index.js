require('dotenv').config()
const {
    LCDClient,
    MsgExecuteContract,
    MnemonicKey,
    StdFee,
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
const fees = new StdFee(1_000_000, { uusd: 200000 })

function worker() {

    setInterval(async function(){
        const msg1 = new MsgExecuteContract(mk.accAddress, process.env.LOTERRA_CONTRACT, {
            play: {}
        })

        wallet
            .createAndSignTx({
                msgs: [msg1],
                memo: 'Automated worker play!',
                gasPrices: fees.gasPrices(),
                gasAdjustment: 1.5,
            })
            .then(tx => terra.tx.broadcast(tx))
            .then(result => {
                console.log(`TX hash: ${result.txhash}`);
            }).catch(e => console.log(e));
        try {
            let res = await terra.wasm.contractQuery(
                process.env.LOTERRA_CONTRACT,
                {
                    get_round: {},
                },
            );
            const res2 = await axios.get(`https://drand.cloudflare.com/public/${res.next_round}`)
            const {round, signature, previous_signature} = res2.data
            let _round = round
            let signature_base64 = Buffer.from(signature, 'hex').toString('base64')
            let previous_signature_base64 = Buffer.from(previous_signature, 'hex').toString('base64')

            const msg = new MsgExecuteContract(mk.accAddress, process.env.TERRAND_CONTRACT, {
                drand:{
                    round: _round,
                    previous_signature: previous_signature_base64,
                    signature: signature_base64
                }
            })

            wallet
                .createAndSignTx({
                    msgs: [msg],
                    memo: 'Automated worker add randomness!',
                    fee: new StdFee(7_000_000, { uusd: 2000000 })
                })
                .then(tx => terra.tx.broadcast(tx))
                .then(result => {
                    console.log(`TX hash: ${result.txhash}`);
                }).catch(e => console.log(e));

        } catch (e) {
            console.log(e)
        }

    }, 60000);
}
worker()