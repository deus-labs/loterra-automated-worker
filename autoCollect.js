require('dotenv').config()
const {
    LCDClient,
    MsgExecuteContract,
    MnemonicKey,
    StdFee,
} = require('@terra-money/terra.js')
const axios = require("axios");

const mk = new MnemonicKey({
    mnemonic: process.env.MNEMONIC,
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
            // this query returns winners of a round
            const getWinners = await axios.get(`https://lcd.terra.dev/wasm/contracts/${process.env.LOTERRA_CONTRACT}/store?query_msg=%7B%22winner%22%3A%7B%22lottery_id%22%3A${config.data.result.lottery_counter - 1}%7D%7D`)
            let winners = getWinners.data.result.winners

            // filter out claimed winners
            let winnerAddrList = winners.filter(w => !w.claims.claimed).map(w => w.address)
            console.log("all winners")
            console.log(winnerAddrList)

            // TODO: collect msgs into an array
            // Put array at msgs field. This will make the tx work batch.
            // Also lower gas adjustment to 1.25
            // If you want you can implement better logging

            let msgs = winnerAddrList.map(w => new MsgExecuteContract(mk.accAddress, process.env.LOTERRA_CONTRACT, {
                collect: { address: w.address }
            }))

            // TODO: 
            // 1 - Contact 0xantz for testing environment
            // 2 - setup scheduled job instead of cron
            // 3 - If necessary limit amount of execute contract in single broadcast, or try increasing gas adjustment
            const tx = await wallet.createAndSignTx({
                msgs: msgs,
                memo: 'Automated collect worker!',
                gasPrices: fees.gasPrices(),
                gasAdjustment: 1.25,
                fee: fees
            })
            const broadcast = await terra.tx.broadcast(tx)
            console.log(broadcast)

        } catch (e) {
            console.log(e)
        }
    }, 9000);
}
worker()