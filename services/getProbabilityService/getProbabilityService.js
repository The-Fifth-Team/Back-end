const mean = dataset => {
    let sum = dataset.reduce((a, b) => a + b, 0);
    return sum / dataset.length;
};
const deviation = (dataset, mean) => {
    let total = 0;
    dataset.forEach(val => {
        total+= Math.pow(val - mean, 2);
    });
    return Math.sqrt(total / dataset.length);
};
const emotionsMapper = (arr) => {
    let acc = { neutral : [], happy : [], sad : [],angry : [],fearful : [], disgusted : [],surprised : []};
    arr.map((val) => {
        acc.neutral.push(val.neutral);
        acc.happy.push(val.happy);
        acc.sad.push(val.sad);
        acc.angry.push(val.angry);
        acc.fearful.push(val.fearful);
        acc.disgusted.push(val.disgusted);
        acc.surprised.push(val.surprised);
    });
    return acc
};
const ZScore2Percentage = (z) => {
    let factK = 1, sum = 0, term = 1,k = 0, loopStop = Math.exp(-23);
    if (z < -6.5){ return 0.0}
    if (z > 6.5){return 1.0}
    if (z > 0) {z = -z}
    while (Math.abs(term) > loopStop) {
        term = .3989422804 * Math.pow(-1, k) * Math.pow(z, k) / (2 * k + 1) / Math.pow(2, k) * Math.pow(z, k + 1) / factK;
        sum += term;
        k++;
        factK *= k;
    }
    sum += 0.5;
    return Math.floor((2 * sum)*100)
};
const zees = (recentData, historicalData) => {
    let avg = {}, standardDeviation ={}, outcome = {};
    let acc = emotionsMapper(historicalData);
    let result = emotionsMapper(recentData);
    //console.log(acc)
    function objectifier (obj, result = []){
        // let accumalator = { neutral : [], happy : [], sad : [],angry : [],fearful : [], disgusted : [],surprised : []};
        let accumalator = {};
        for (var i = 0; i < recentData.length; i++) {
            for (let key in obj) {
                accumalator[key] = obj[key][i];
            }
            accumalator["userId"] = recentData[i]['userId'];
            accumalator["createdAt"] = recentData[i]['createdAt'];
            result.push(accumalator)
            accumalator = {}
        }
        return result
    }
    for (let key in acc) {
        avg[key] = mean(acc[key])
    }
    for (let key in acc) {
        standardDeviation[key] = deviation(acc[key], avg[key]);
    }
    for (let key in acc) {
        outcome[key] = result[key].map((num) => {
            let z = (num - avg[key]) / standardDeviation[key];
            return ZScore2Percentage(z)
        })
    }
    return objectifier(outcome)
};
module.exports = zees;