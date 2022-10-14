let tradeTime = document.querySelectorAll('.el-table_5_column_25 ')
let allTx = document.querySelectorAll('.el-table_5_column_32 ')
let allPnl = document.querySelectorAll('.el-table_5_column_34 ')
let tradeID = document.querySelectorAll('.el-table_5_column_37 ')
let totalPnl = 0
let totalTxFee = 0
let totalTrades = 0
let netPnl = 0
let array = []
let array2 = []
let obj = {}

// loop through daily data
for (let i=0; i<tradeTime.length; i++) {
    let tradeDuration = tradeTime[i].innerText.split(' ')
    let todayDate = new Date().toLocaleDateString();
    let tradeDate = new Date(tradeDuration[0]).toLocaleDateString()

    if (todayDate == tradeDate) {
        array.push({id: tradeID[i].innerText, value: tradeDuration[1]})
        array2.push({id: tradeID[i].innerText, value: tradeTime[i].innerText})
        totalTxFee += Number(allTx[i].innerText)

        if (allPnl[i].innerText[0] == '+'){
            // console.log('beep')
            totalPnl += Number(allPnl[i].innerText.slice(1))
        } else if (allPnl[i].innerText[0] == '-') {
            if (allPnl[i].innerText[1] !== '-'){
                // console.log('boop')
                totalPnl -= Number(allPnl[i].innerText.slice(1))
            }
        } else {
            console.log('debug info')
        }
    }
}

// trade duration data processing
let dur = []
let minutesArray = []
let secondsArray = []
for (let i=0; i<array.length; i++) {
    let arrayID = (array[i].id)
    array[i].value = array[i].value.replace(/:/g, '')
    const matchingTrades = array.filter(item => item.id === arrayID)
    if (matchingTrades.length > 1) {
        // max length is 1 by design
        let duration = matchingTrades[0].value - matchingTrades[1].value
        if (isNaN(duration)) {
            console.log('debug info 2')
        } else {
            dur.push(duration)
        }
    }
}

for (let i=0; i<dur.length; i++) {
    let stringDur = dur[i].toString()
    if (stringDur.length >= 3) {
        minutesArray.push(stringDur.slice(0, -2))
        secondsArray.push(stringDur.slice(-2))
    } else {
        secondsArray.push(stringDur)
    }
}
const totalMinutes = minutesArray.reduce((accumulator, object) => accumulator  + Number((object*60)), 0)
const totalSeconds = secondsArray.reduce((accumulator, object) => accumulator  + Number((object)), 0)
const totalTime = totalMinutes + totalSeconds

// count and summary
let fiveMin = 0
let belowFiveMin = 0

dur.forEach(item => {
    if (item>=500) {
        fiveMin++
    } else {
        belowFiveMin++
    }
})

netPnl = totalPnl-(totalTxFee/2) 
totalTrades = fiveMin + belowFiveMin


console.log(`${fiveMin} trades over 5 minutes.
\n${belowFiveMin} trades below 5 minutes.
\n${100*(fiveMin/(totalTrades))}% trades over 5 minutes.
\n-----------------------------------------------
\naverage time per trade: ${(totalTime/totalTrades)/60} minutes
\n-----------------------------------------------
\ntotal number of trades: ${totalTrades}/40
\n-----------------------------------------------
\ntotal tx cost incurred today is $${totalTxFee}
\n-----------------------------------------------
\ntotal net PnL today is $${netPnl}`)