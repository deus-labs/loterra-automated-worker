require('dotenv').config()
const fs = require('fs')
const csv = require('csv-parser');
const axios = require("axios")

const {
    LCDClient,
    MsgExecuteContract,
    MsgInstantiateContract,
    MsgMigrateContract,
    MnemonicKey,
    StdFee,
    Coin,
    MsgGrantAuthorization
} = require('@terra-money/terra.js')
const mk = new MnemonicKey({
    mnemonic:
    process.env.MNEMONIC,
});
/*
{
    "name": "bombay",
    "chainID": "bombay-0007",
    "lcd": "https://bombay-lcd.terra.dev",
    "fcd": "https://bombay-fcd.terra.dev"
}*/
const terra = new LCDClient({
    URL: "https://lcd.terra.dev/",
    chainID: "columbus-4",
})
/*
const terra = new LCDClient({
    URL: "https://tequila-lcd.terra.dev",
    chainID: "tequila-0004",
})*/
const wallet = terra.wallet(mk)
const fees = new StdFee(400_000, { uusd: 80000 })
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// terra136qygjmsusuutemwe65uwnxg7jfekzyrnzfhj9
// terra19ltv8g7nltj5da4hex3nx3ahd8v9dzmm5kjshv

// testnet contract = terra1fh2je8z4gajnvfm6xd80hqc3cpga0gsl396rls

// ALTERED terra19xvyr7c7j8pnp5r96ymcxnv26a4rgfz0xjjcal
//fs.writeFile('airdropped.csv', '', function(){console.log('Csv is cleaned for new run')})
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'airdropped_two.csv',
    header: [
        {id: 'address', title: 'address'},
        {id: 'airdrop_amount', title: 'airdrop_amount'},
        {id: 'success', title: 'success'},
        {id: 'total_balance', title: 'total_balance'},
    ]
});
async function sand() {
    /*const msg1 = new MsgInstantiateContract( mk.accAddress, 297,
    {
        "name": "altered",
        "symbol": "ALTE",
        "decimals": 6,
        "initial_balances": [
        {
            "address": mk.accAddress,
            "amount": "100000000000000"
        }
    ],
        "rebase": 1629288000,
        "rebase_every": 86400,
        "rebase_damping": 10,
        "rebase_damping_launch": 1631707200,
        "pair_address": "terra156v8s539wtz0sjpn8y8a8lfg8fhmwa7fy22aff"
    }
    , false, true) */

    /*const msg1 = new MsgMigrateContract(mk.accAddress, "terra102jv62g9crsy87zyfjms4lxpmkwkzlrw2n98za", 7960,
        {
            "name": "altered",
            "symbol": "ALTE",
            "decimals": 6,
            "initial_balances": [
                {
                    "address": mk.accAddress,
                    "amount": "100000000000000"
                }
            ],
            "rebase": 1629288000,
            "rebase_every": 86400,
            "rebase_damping": 10,
            "rebase_damping_launch": 1631708371,
            "pair_address": "terra156v8s539wtz0sjpn8y8a8lfg8fhmwa7fy22aff"
        })*/

    /*const msg1 = new MsgExecuteContract(mk.accAddress, "terra1jmr4ed6cfy7tcafaqh7ehhapq6uw2a7azfdkaw",
        //"update_terraswap_address" :{"address":""}
    {
        "increase_allowance": {
        "spender": "terra12p2qrf0jg3k98kp60mk3m64z7n3psahgexmhjk",
            "amount": "100000000000000"
    }
    })*/
    /*
    {
            "provide_liquidity": {
                "assets": [
                    {
                        "info" : {
                            "token": {
                                "contract_addr": "terra15tztd7v9cmv0rhyh37g843j8vfuzp8kw0k5lqv"
                            }
                        },
                        "amount": "100000000000000"
                    },
                    {
                        "info" : {
                            "native_token": {
                                "denom": "uusd"
                            }
                        },
                        "amount": "4000000000"
                    }
                ],
                "slippage_tolerance": "1"
            }
        }
     */
    /*const msg1 = new MsgExecuteContract(mk.accAddress, "terra12p2qrf0jg3k98kp60mk3m64z7n3psahgexmhjk",{
        "provide_liquidity": {
            "assets": [
                {
                    "info" : {
                        "token": {
                            "contract_addr": "terra1ke2gz90rykm52t06grkjzxaed2ngz73d65nev2"
                        }
                    },
                    "amount": "40000000000000"
                },
                {
                    "info" : {
                        "native_token": {
                            "denom": "uusd"
                        }
                    },
                    "amount": "79000000000"
                }
            ]
        }

    }, {"uusd": "24000000"})*/

    /*const msg1 = new MsgExecuteContract(mk.accAddress, "terra10a2w37pwwqvyd8z6eefvzl4d7hak0c7mkm2w6w",{
        "swap": {
            "offer_asset": {
                "info" : {
                    "native_token": {
                        "denom": "uusd"
                    }
                },
                "amount": "1"
            }
        }
    }, {"uusd": "1"})*/

    /*const msg1 = new MsgExecuteContract(mk.accAddress, "terra19xvyr7c7j8pnp5r96ymcxnv26a4rgfz0xjjcal",
        {
            "send": {
                "contract": "terra10a2w37pwwqvyd8z6eefvzl4d7hak0c7mkm2w6w",
                "amount": "10000000000",
                "msg": "eyJzd2FwIjp7fX0="
            }
        }) */
    /*const msg1 = new MsgExecuteContract(mk.accAddress, "terra19xvyr7c7j8pnp5r96ymcxnv26a4rgfz0xjjcal",
        {
            "rebase": {
            }
        })*/
    /*const msg1 = new MsgExecuteContract(mk.accAddress, "terra1nkjjjfejhlke9926sux0dqfja3qyfe6uzt8yhn",
        {
            "swap": {
                "offer_asset": {
                    "info" : {
                        "native_token": {
                            "denom": "uusd"
                        }
                    },
                    "amount": "350000000"
                }
            }
        }, {"uusd": "350000000"})
*/
/*
{ "send": { "contract": "terra1nkjjjfejhlke9926sux0dqfja3qyfe6uzt8yhn", "amount": "1777638883463", "msg": "ewogICJ3aXRoZHJhd19saXF1aWRpdHkiOiB7fQp9" } }
 */

    let data = []
    let total_amount = 0
    let last_seq= 0
    fs.createReadStream('records.csv')
        .pipe(csv())
        .on('data',(row) => {

            if (row.address !="terra1th7wznjznnyck42v3eyma6cukqvrttsq75cu5a"
                && row.address != "terra1e7hzp3tnsswpfcu6gt4wlgfm20lcsqqywhaagu"
                && row.address != "terra14mevcmeqt0n4myggt7c56l5fl0xw2hwa2mhlg0"
                && row.address != "terra1zcf0d95z02u2r923sgupp28mqrdwmt930gn8x5"
                && row.address != "terra1342fp86c3z3q0lksq92lncjxpkfl9hujwh6xfn"
                && row.address != "terra1pn20mcwnmeyxf68vpt3cyel3n57qm9mp289jta"
                && row.address != "terra1qp0z7akj3s3dmgn5necj9l0fcpjuyd5yjqeqt2"){

                let balance = parseInt(row.balances) ? parseInt(row.balances) : 0;
                let pending_claims = parseInt(row.pending_claims) ? parseInt(row.pending_claims): 0;
                let staking_balance = parseInt(row.staking_balances) ? parseInt(row.staking_balances): 0;
                let lp_balances = parseInt(row.lp_balances)? parseInt(Math.trunc(row.lp_balances)):0
                let bal = balance + pending_claims + staking_balance  + lp_balances
                total_amount += bal
                row.total_bal = bal
                data.push(row)
            }

        })
        .on('end', () => {
            let sum = 0

            console.log((3_130_000_000_000 / total_amount))
            data.map(async (e, index) => {
                //console.log(Math.trunc(e.total_bal * (5_000_000_000_000 / total_amount)))
                //sum +=Math.trunc(e.total_bal * (5_000_000_000_000 / total_amount))
                try {
                    await sleep(120000*index)
                    if (e.total_bal != 0){
                        //console.log((5_000_000_000_000 / total_amount))
                        //console.log(e.address, e.total_bal, (e.total_bal * (5_000_000_000_000 / total_amount)).toFixed(0).toString())
                        const msg1 = new MsgExecuteContract(mk.accAddress, "terra15tztd7v9cmv0rhyh37g843j8vfuzp8kw0k5lqv",{
                            "transfer": {
                                "recipient": e.address,
                                "amount": (e.total_bal * (3_130_000_000_000 / total_amount)).toFixed(0).toString()
                            }
                        })
                        seq = await axios.get('https://lcd.terra.dev/auth/accounts/terra1e5h0yt7zr2smujd2pwscv0lvhlyct3y0mgckce');
                        console.log(seq.data.result.value.sequence)
                        let tx_play = await wallet.createAndSignTx({
                            msgs: [msg1],
                            memo: 'Airdrop ALTE for LOTA holders!',
                            fee: fees,
                            sequence: seq.data.result.value.sequence
                        } );
                        console.log(tx_play)
                        let tx = await terra.tx.broadcast(tx_play)
                        console.log(msg1)
                        console.log('write csv')
                        console.log(tx)
                        let res = tx.code ? 'false' : 'true'
                        console.log(res)
                        const record = [{address: e.address,  airdrop_amount: Math.trunc(e.total_bal * (3_130_000_000_000 / total_amount)),success: res, total_balance: e.total_bal}];
                        await csvWriter.writeRecords(record)
                        //let amount = e.total_bal * (5_000_000_000_000 / total_amount)
                        //console.log(amount.toFixed(0))
                        last_seq = seq.data.result.value.sequence


                    }
                }catch (e) {
                    console.log(e)
                }
            })
            console.log('CSV file successfully processed');
        });




   /* data.map(async (e) => {
        try {
            await sleep(500);
            const msg1 = new MsgExecuteContract(mk.accAddress, "terra15tztd7v9cmv0rhyh37g843j8vfuzp8kw0k5lqv",{
                "transfer": {
                    "amount": row.amount
                }
            })

            let tx_play = await wallet.createAndSignTx({
                msgs: [msg1],
                memo: 'Automated!',
                fee: fees
            } );
            //console.log(tx_play)
            let tx = await terra.tx.broadcast(tx_play)
            console.log(tx)
        }catch (e) {
            console.log(e)
        }
    })*/


    //let msg1 = new MsgGrantAuthorization(undefined, undefined, undefined, undefined)


}
sand()