require('dotenv').config()
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
    URL: "https://tequila-lcd.terra.dev",
    chainID: "tequila-0004",
})
/*
const terra = new LCDClient({
    URL: "https://tequila-lcd.terra.dev",
    chainID: "tequila-0004",
})*/
const wallet = terra.wallet(mk)
const fees = new StdFee(500_000, { uusd: 20000000 })

// terra136qygjmsusuutemwe65uwnxg7jfekzyrnzfhj9
// terra19ltv8g7nltj5da4hex3nx3ahd8v9dzmm5kjshv

// testnet contract = terra1fh2je8z4gajnvfm6xd80hqc3cpga0gsl396rls

// ALTERED terra19xvyr7c7j8pnp5r96ymcxnv26a4rgfz0xjjcal
async function sand() {
    const msg2 = new MsgInstantiateContract( mk.accAddress, 7958,
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
        "rebase": 1624294565,
        "rebase_every": 86400,
        "rebase_damping": 10,
        "rebase_damping_launch": 0,
        "pair_address": "terra156v8s539wtz0sjpn8y8a8lfg8fhmwa7fy22aff"
    }
    , false, true)

    /*const msg1 = new MsgMigrateContract(mk.accAddress, "terra102jv62g9crsy87zyfjms4lxpmkwkzlrw2n98za", 7959,
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
            "rebase": 1624294565,
            "rebase_every": 86400,
            "rebase_damping": 10,
            "rebase_damping_launch": 0,
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
                                "contract_addr": "terra10ua5mu4yn28t0rsr6u7awnml0t6cnt89qp6tdp"
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
                            "contract_addr": "terra1les6rz5ktjf44lcv35tl0a3a9rvkux9gdlzces"
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
    //let msg1 = new MsgGrantAuthorization(undefined, undefined, undefined, undefined)
    try {
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

}
sand()