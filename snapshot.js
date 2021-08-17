
const axios = require("axios")
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

        }

        console.log(accounts)

        accounts.map(async (address, index) => {
            try {
                let balance = await axios.get(`https://lcd.terra.dev/wasm/contracts/terra1ez46kxtulsdv07538fh5ra5xj8l68mu8eg24vr/store?query_msg=%7B%22balance%22%3A%7B%20%22address%22%3A%22${address}%22%7D%7D
            `)

                balances.push(balance.data.result.balance)
            }
            catch (e) {
              console.log(e)
            }

        })
        console.log(balances)



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