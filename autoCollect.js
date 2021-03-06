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

const scheduler = require('node-schedule');
// run x minutes after next draw time
const offsetMins = 5;

function scheduleNextRun(nextDrawTime) {
    var nextRunDate = new Date((nextDrawTime + offsetMins * 60) * 1000)
    const job = scheduler.scheduleJob(nextRunDate, () => worker())
    console.log('next run: ' + job.nextInvocation())
}

async function worker() {
    let nextDrawTime = 0
    try {
        const config = await axios.get(`https://lcd.terra.dev/wasm/contracts/${process.env.LOTERRA_CONTRACT}/store?query_msg=%7B%22config%22%3A%7B%7D%7D`);
        nextDrawTime = config.data.result.block_time_play
        // this query returns winners of a round
        const getWinners = await axios.get(`https://lcd.terra.dev/wasm/contracts/${process.env.LOTERRA_CONTRACT}/store?query_msg=%7B%22winner%22%3A%7B%22lottery_id%22%3A${config.data.result.lottery_counter - 1}%7D%7D`)
        let winners = getWinners.data.result.winners

        // filter out claimed winners
        let winnerAddrList = winners.filter(w => !w.claims.claimed).map(w => w.address)

        console.log("all winners")
        console.log(winnerAddrList)

        let msgs = winnerAddrList.map(w => new MsgExecuteContract(mk.accAddress, process.env.LOTERRA_CONTRACT, {
            collect: { address: w.address }
        }))

        // TODO: 
        // 1 - Contact 0xantz for testing environment
        // 2 - If necessary limit amount of execute contract in single broadcast, or try increasing gas adjustment
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
    scheduleNextRun(nextDrawTime)
}
worker()