
const axios = require("axios")

//On eache run of script clean csv, be sure to copy data if important
const fs = require('fs')
fs.writeFile('records.csv', '', function(){console.log('Csv is cleaned for new run')})

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'records.csv',
    header: [
        {id: 'address', title: 'address'},
        {id: 'balances', title: 'balances'},
        {id: 'pending_claims', title: 'pending_claims'},
        {id: 'staking_balances', title: 'staking_balances'},
        {id: 'lp_balances', title: 'lp_balances'}
    ]
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


async function snap(){
    try{
    const validators = await  axios.get("https://lcd.terra.dev/staking/validators?status=bonded&page=1&limit=150");

    let validatorsAddresses = validators.data.result.map(e => e.operator_address)
    let addresses = [];
    let balances = [];
    let f = validatorsAddresses.map(async (addr) => {
        const delegators = await axios.get(`https://lcd.terra.dev/staking/validators/${addr}/delegations`);
        delegators.data.result.map(d => {

            if (addresses.includes(d.delegator_address)){
                balances[addresses.indexOf(d.delegator_address)] += parseInt(d.balance.amount)
            }else{
                addresses.push(d.delegator_address)
                balances.push(parseInt(d.balance.amount))
            }

        })
    })

    let addressAndBalance = []
    Promise.all(f).then((e)=>{
        for (let x = 0; x < addresses.length; x++){
            let data = {
                addr: addresses[x],
                bal: balances[x]
            }
            addressAndBalance.push(data)
        }
        console.log(addressAndBalance)
        console.log("all staked")
        console.log(balances.reduce((a, b) => a + b, 0));
    }).catch(err =>{
        console.log(err)
    })

    } catch (e) {
        console.log(e)
    }





    /*Promise.all(validatorsAddresses)
        .then((val) => {

            val.forEach(async addr => {

                // console.log(delegators.data.result)
                Promise.all(delegators).then((del) => {
                    console.log(del)
                }).catch((error) => {
                    console.log(error)
                })
            })

            // everything succeeded
        }).catch((error) => {
        console.log(error)
        // there was an error
    });*/

}
async function snapLota() {
    try{
        let accounts = []
        let balances = []
        let pending_claims = []
        let staking_balances = []
        let lp_balances = []

        let loop = true
        while (loop) {
            let all_accounts
            if (accounts.length == 0){
                all_accounts = await axios.get(`https://lcd.terra.dev/wasm/contracts/terra1ez46kxtulsdv07538fh5ra5xj8l68mu8eg24vr/store?query_msg=%7B%22all_accounts%22%3A%7B%20%22limit%22%3A30%7D%7D
            `)
            }else{
                all_accounts = await axios.get(`https://lcd.terra.dev/wasm/contracts/terra1ez46kxtulsdv07538fh5ra5xj8l68mu8eg24vr/store?query_msg=%7B%22all_accounts%22%3A%7B%20%22start_after%22%3A%22${accounts.pop()}%22%2C%22limit%22%3A30%7D%7D
            `)
            }

            if (all_accounts.data.result.accounts) {
                accounts.push(...all_accounts.data.result.accounts)
                //console.log(accounts)
            }

            if (all_accounts.data.result.accounts.length < 30) {
                loop = false
            }
            console.log('sleep now');
            await sleep(500);
            console.log('sleep off')
        }

        console.log(accounts)
        // This get balance of all user
        accounts.map( async (address, index) => {
            await sleep(1000*index)
            console.log('sleep balance ',address)       
     
            try {                   
                let balance = await axios.get(`https://lcd.terra.dev/wasm/contracts/terra1ez46kxtulsdv07538fh5ra5xj8l68mu8eg24vr/store?query_msg=%7B%22balance%22%3A%7B%20%22address%22%3A%22${address}%22%7D%7D
            `)

                balances.push(parseInt(balance.data.result.balance))
            }
            catch (e) {
              console.log(e)
            }
          
        })
        console.log(balances)
        // This get balance of all unstaking pending to claims
        accounts.map( async (address, index) => {
            await sleep(1000*index)
            console.log('sleep balance ',address)

            try {
                let balance = await axios.get(`https://lcd.terra.dev/wasm/contracts/terra1342fp86c3z3q0lksq92lncjxpkfl9hujwh6xfn/store?query_msg=%7B%22claims%22%3A%7B%22address%22%3A%22${address}%22%7D%7D
            `)
                balance.data.result.claims.map(claim => {
                    pending_claims.push(parseInt(claim.amount))
                })
            }
            catch (e) {
                console.log(e)
            }

        })

        // This get balance of all staking account
        accounts.map( async (address, index) => {
            await sleep(1000*index)
            console.log('sleep balance ',address)

            try {
                let holder = await axios.get(`https://lcd.terra.dev/wasm/contracts/terra1342fp86c3z3q0lksq92lncjxpkfl9hujwh6xfn/store?query_msg=%7B%22holder%22%3A%7B%22address%22%3A%22${address}%22%7D%7D
            `)
                staking_balances.push(parseInt(holder.data.result.balance))
               
                

            }
            catch (e) {
                console.log(e)
            }
 

        })

        // This get balance of liquidity provided terraswap
        let pool = await axios.get(`https://lcd.terra.dev/wasm/contracts/terra1pn20mcwnmeyxf68vpt3cyel3n57qm9mp289jta/store?query_msg=%7B%22pool%22%3A%7B%7D%7D`)
        let total_lota_pool = parseInt(pool.data.result.assets[0].amount)
        let token_info = await axios.get(`https://lcd.terra.dev/wasm/contracts/terra1t4xype7nzjxrzttuwuyh9sglwaaeszr8l78u6e/store?query_msg=%7B%22token_info%22%3A%7B%7D%7D`);
        let total_lp_lota = parseInt(token_info.data.result.total_supply)
        let amount_of_lota_per_lp = total_lota_pool / total_lp_lota

        accounts.map( async (address, index) => {
            await sleep(1000*index)
            console.log('sleep balance ',address)

            try {
                let get_holder_lp_balance = await axios.get(`https://lcd.terra.dev/wasm/contracts/terra1t4xype7nzjxrzttuwuyh9sglwaaeszr8l78u6e/store?query_msg=%7B%22balance%22%3A%7B%22address%22%3A%22${address}%22%7D%7D
            `)
                let amount = (parseInt(get_holder_lp_balance.data.result.balance) / 1000000) * amount_of_lota_per_lp
                lp_balances.push(amount)
//Save row to csv 
                await csvWriter.writeRecords({address: accounts[index],  balances: balances[index],pending_claims: pending_claims[index], staking_balances: staking_balances[index], lp_balances: lp_balances[index]})
            }
            catch (e) {
                console.log(e)
            }

        })





/*
        const validators = await  axios.get("https://lcd.terra.dev/staking/validators?status=bonded&page=1&limit=150");

        let validatorsAddresses = validators.data.result.map(e => e.operator_address)
        let addresses = [];
        let balances = [];
        let f = validatorsAddresses.map(async (addr) => {
            const delegators = await axios.get(`https://lcd.terra.dev/staking/validators/${addr}/delegations`);
            delegators.data.result.map(d => {

                if (addresses.includes(d.delegator_address)){
                    balances[addresses.indexOf(d.delegator_address)] += parseInt(d.balance.amount)
                }else{
                    addresses.push(d.delegator_address)
                    balances.push(parseInt(d.balance.amount))
                }

            })
        })

        let addressAndBalance = []
        Promise.all(f).then((e)=>{
            for (let x = 0; x < addresses.length; x++){
                let data = {
                    addr: addresses[x],
                    bal: balances[x]
                }
                addressAndBalance.push(data)
            }
            console.log(addressAndBalance)
            console.log("all staked")
            console.log(balances.reduce((a, b) => a + b, 0));
        }).catch(err =>{
            console.log(err)
        })
*/

    

    } catch (e) {
        //console.log(e)
    }
}

// snap()
snapLota()


