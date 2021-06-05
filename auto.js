require('dotenv').config()
const {
    LCDClient,
    MsgExecuteContract,
    MnemonicKey,
    StdFee,
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
const fees = new StdFee(1_000_000, { uusd: 200000 })
function worker() {

    setInterval(async function(){

        let players = []
        let winners = []
        try {
            let config = await terra.wasm.contractQuery(
                process.env.LOTERRA_CONTRACT,
                {
                    config: {},
                },
            );
            winners = await terra.wasm.contractQuery(
                process.env.LOTERRA_CONTRACT,
                {
                    winner: {lottery_id: config.lottery_counter - 1},
                },
            );
            players = await terra.wasm.contractQuery(
                process.env.LOTERRA_CONTRACT,
                {
                    players: {lottery_id: config.lottery_counter - 1},
                },
            );

        } catch (e) {
            console.log(e)
        }
        console.log(players)
        players.forEach(player =>{
            let msg = new MsgExecuteContract(mk.accAddress, process.env.LOTERRA_CONTRACT, {
                claim:{ addresses:[player]}
            })
            wallet
                .createAndSignTx({
                    msgs: [msg],
                    memo: 'Automated claim worker!',
                    gasPrices: fees.gasPrices(),
                    gasAdjustment: 1.5,
                })
                .then(tx => terra.tx.broadcast(tx))
                .then(result => {
                    console.log(`TX hash: ${result.txhash}`);
                }).catch(e => console.log(e));
        })
        console.log(winners)
        winners.winners.forEach(winner => {
            let msg = new MsgExecuteContract(mk.accAddress, process.env.LOTERRA_CONTRACT, {
                collect:{ address: winner.address}
            })
            wallet
                .createAndSignTx({
                    msgs: [msg],
                    memo: 'Automated collect worker!',
                    gasPrices: fees.gasPrices(),
                    gasAdjustment: 1.5,
                })
                .then(tx => terra.tx.broadcast(tx))
                .then(result => {
                    console.log(`TX hash: ${result.txhash}`);
                }).catch(e => console.log(e));
        })

    }, 60000);
}
worker()