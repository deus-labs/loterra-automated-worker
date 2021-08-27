require('dotenv').config()
const {
    LCDClient,
    MsgExecuteContract,
    MnemonicKey,
    StdFee,
} = require('@terra-money/terra.js')
const axios = require("axios");

const mk = new MnemonicKey({
    mnemonic:process.env.MNEMONIC,
});
const terra = new LCDClient({
    URL: process.env.LCD_URL,
    chainID: process.env.CHAIN_ID,
})
const wallet = terra.wallet(mk)
const fees = new StdFee(400_000, { uusd: 65000 })
function worker() {

    setInterval(async function(){
        let players = []
        try {
            const config = await axios.get("https://lcd.terra.dev/wasm/contracts/terra14mevcmeqt0n4myggt7c56l5fl0xw2hwa2mhlg0/store?query_msg=%7B%22config%22%3A%7B%7D%7D");
            const res = await axios.get("https://lcd.terra.dev/wasm/contracts/terra14mevcmeqt0n4myggt7c56l5fl0xw2hwa2mhlg0/store?query_msg=%7B%22players%22%3A%7B%22lottery_id%22%3A4%7D%7D");
            players = res.data.result
        } catch (e) {
            console.log(e)
        }
        let addr = []

        try {
            let msgs_one = new MsgExecuteContract(mk.accAddress, "terra14mevcmeqt0n4myggt7c56l5fl0xw2hwa2mhlg0", {
                "claim":{ "addresses":addr},
            })
            const tx = await wallet.createAndSignTx({
                msgs: [msgs_one],
                memo: 'Automated claim worker!',
                fee: fees,
            })
            const broadcast = await terra.tx.broadcast(tx)
            console.log(broadcast)
        }catch (e) {
            console.log(e)
        }
    }, 5000);

}
worker()