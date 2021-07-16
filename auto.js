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
const fees = new StdFee(400_000, { uusd: 65000 })
function worker() {

    setInterval(async function(){
        let winners = []
        let players = []
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

        winners.winners.forEach(winner => {
            if (winner.claims.claimed == false) {
                console.log(winner.address)
                let msg = new MsgExecuteContract(mk.accAddress, process.env.LOTERRA_CONTRACT, {
                    collect: {address: winner.address}
                })
                wallet.createAndSignTx({
                    msgs: [msg],
                    memo: 'Automated collect worker!',
                    fee: fees,
                }).then(result => terra.tx.broadcast(result)).catch(err => console.log(err))

                /*let winner_interval = setInterval(async function(){
                    let tx = await wallet.createAndSignTx({
                        msgs: [msg],
                        memo: 'Automated collect worker!',
                        gasPrices: fees.gasPrices(),
                        gasAdjustment: 1.5,
                    })
                    await terra.tx.broadcast(tx)

                }, 10000)
                // clear interval
                if (winner.address == winners.winners[winners.winners.length - 1].address) {
                    clearInterval(winner_interval);
                }*/
            }
        })

        players.forEach(player =>{
            let msgs_one = new MsgExecuteContract(mk.accAddress, process.env.LOTERRA_CONTRACT, {
                claim:{ addresses:[player]}
            })
            wallet.createAndSignTx({
                msgs: [msgs_one],
                memo: 'Automated claim worker!',
                fee: fees,
            }).then(result => terra.tx.broadcast(result)).catch(err => console.log(err))
            /*let play_interval = setInterval(async function(){
                try {
                    let tx = await wallet.createAndSignTx({
                        msgs: [msgs_one],
                        memo: 'Automated claim worker!',
                        gasPrices: fees.gasPrices(),
                        gasAdjustment: 1.5,
                    })
                    await terra.tx.broadcast(tx)

                }catch (e) {
                    console.log(e)
                }
            }, 10000)
            // clear interval
            if (player == players[players.length - 1]) {
                clearInterval(play_interval);
            } */
        })
        //let msgs_one = [];
    }, 300000);

}
worker()