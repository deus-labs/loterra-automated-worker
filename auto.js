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

        } catch (e) {
            console.log(e)
        }

        winners.winners.forEach(winner => {
            if (winner.claims.claimed == false) {
                console.log(winner.address)
                let msg = new MsgExecuteContract(mk.accAddress, process.env.LOTERRA_CONTRACT, {
                    collect: {address: winner.address}
                })
                setInterval(async function(){
                    let tx = await wallet.createAndSignTx({
                        msgs: [msg],
                        memo: 'Automated collect worker!',
                        gasPrices: fees.gasPrices(),
                        gasAdjustment: 1.5,
                    })
                    await terra.tx.broadcast(tx)

                }, 10000)
            }
        })
        //let msgs_one = [];

        console.log(winners)

    }, 300000);

    setInterval(async function(){
        let players = []
        try {
            let config = await terra.wasm.contractQuery(
                process.env.LOTERRA_CONTRACT,
                {
                    config: {},
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

        players.forEach(player =>{
            let msgs_one = new MsgExecuteContract(mk.accAddress, process.env.LOTERRA_CONTRACT, {
                claim:{ addresses:[player]}
            })
            setInterval(async function(){
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

        })
        console.log(players)
    }, 600000)

}
worker()