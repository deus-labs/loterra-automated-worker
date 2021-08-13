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
        //let winners = []
        let players = []
        try {
            const config = await axios.get("https://lcd.terra.dev/wasm/contracts/terra14mevcmeqt0n4myggt7c56l5fl0xw2hwa2mhlg0/store?query_msg=%7B%22config%22%3A%7B%7D%7D");
            /*winners = await terra.wasm.contractQuery(
                process.env.LOTERRA_CONTRACT,
                {
                    winner: {lottery_id:  config.data.result.lottery_counter - 1},
                },
            );
            console.log(winners)*/
            const res = await axios.get("https://lcd.terra.dev/wasm/contracts/terra14mevcmeqt0n4myggt7c56l5fl0xw2hwa2mhlg0/store?query_msg=%7B%22players%22%3A%7B%22lottery_id%22%3A4%7D%7D");
            players = res.data.result
            /*players = await terra.wasm.contractQuery(
                process.env.LOTERRA_CONTRACT,
                {
                    players: {lottery_id:  config.data.result.lottery_counter - 1},
                },
            );
            console.log(players)*/

        } catch (e) {
            console.log(e)
        }

        /*winners.winners.forEach(winner => {
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
            }
        })*/
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



      /* players.forEach(player =>{
           let msgs_one = new MsgExecuteContract(mk.accAddress, "terra14mevcmeqt0n4myggt7c56l5fl0xw2hwa2mhlg0", {
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
            }
        })*/
        //let msgs_one = [];
    }, 5000);

}
worker()