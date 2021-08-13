require('dotenv').config()
const {
    LCDClient,
    MsgExecuteContract,
    MnemonicKey,
    StdFee,
} = require('@terra-money/terra.js')
const axios = require("axios");

const mk = new MnemonicKey({
    mnemonic:
    process.env.MNEMONIC,
});
const terra = new LCDClient({
    URL: process.env.LCD_URL,
    chainID: process.env.CHAIN_ID,
})
const wallet = terra.wallet(mk)
const fees = new StdFee(700_000, { uusd: 106000 })
function worker() {

    setInterval(async function () {
        try {
            const config = await axios.get(`https://lcd.terra.dev/wasm/contracts/${process.env.LOTERRA_CONTRACT}/store?query_msg=%7B%22config%22%3A%7B%7D%7D`);
            const getWinners = await axios.get(`https://lcd.terra.dev/wasm/contracts/${process.env.LOTERRA_CONTRACT}/store?query_msg=%7B%22winner%22%3A%7B%22lottery_id%22%3A${config.data.result.lottery_counter - 1}%7D%7D`)
            let winners = getWinners.data.result.winners
            console.log(winners)

            let winners_res = winners.map(async winner => {
                if (winner.claims.claimed == false) {
                    console.log(winner.address)
                    let msg = new MsgExecuteContract(mk.accAddress, process.env.LOTERRA_CONTRACT, {
                        collect: {address: winner.address}
                    })
                    return msg
                    /*let result = await wallet.createAndSignTx({
                        msgs: [msg],
                        memo: 'Automated collect worker!',
                        fee: fees,
                    })
                    console.log(result)*/
                    //let send = await terra.tx.broadcast(result)
                    //console.log(send)
                }
            })
            console.log("all winners")
            console.log(winners_res)
            let result = await Promise.all(winners_res)

            var filtered = result.filter(function (el) {
                return el != null;
            });
            console.log("The result")
            console.log(filtered)

            /*let tx = wallet.createAndSignTx({
                msgs: filtered,
                memo: 'Automated collect worker!',
                fee: fees,
            }).then(result => terra.tx.broadcast(result)).catch(err => console.log(err)) */

            const tx = await wallet.createAndSignTx({
                msgs: filtered,
                memo: 'Automated collect worker!',
                gasPrices: fees.gasPrices(),
                gasAdjustment: 1.5,
                fee: fees
            })
            const broadcast = await terra.tx.broadcast(tx)
            console.log(broadcast)

        } catch (e) {
            console.log(e)
            console.log("what??")
        }


        //let msgs_one = [];
    }, 9000);
}
worker()