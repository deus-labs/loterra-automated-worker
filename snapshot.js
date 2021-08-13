
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
snap()