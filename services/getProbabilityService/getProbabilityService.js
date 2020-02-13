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
}

const emotionsMapper = (arr) => {
  let acc = { neutral : [], happy : [], sad : [],angry : [],fearful : [], disgusted : [],surprised : []};
  arr.map((val) => {
      acc.neutral.push(val.neutral)
      acc.happy.push(val.happy)
      acc.sad.push(val.sad)
      acc.angry.push(val.angry)
      acc.fearful.push(val.fearful)
      acc.disgusted.push(val.disgusted)
      acc.surprised.push(val.surprised)

  })
  return acc
}

const zees = (recentData, historicalData) => {
  let avg = {}, standardDeviation ={}, outcome = {};


  let acc = emotionsMapper(historicalData)
  let result = emotionsMapper(recentData)

  for (let key in acc) {
    avg[key] = mean(acc[key])
  }

  for (let key in acc) {
    standardDeviation[key] = deviation(acc[key], avg[key])
  }

  for (let key in acc) {
    outcome[key] = result[key].map((num) => {
      let z = (num - avg[key]) / standardDeviation[key]
      return ZScore2Percentage(z)
    })
  }

   return objectifier(outcome)
}

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
}



var initialData = [{
    neutral: 0,
    happy: 1,
    sad: 2,
    angry: 3,
    fearful: 4,
    disgusted: 5,
    surprised: 6,
    userId: "Ahmed",
    createdAt: "125500"
  },
  {
      neutral: 0,
      happy: 2,
      sad: 3,
      angry: 4,
      fearful: 5,
      disgusted: 6,
      surprised: 7,
      userId: "ahmed2",
      createdAt: "125500"
    },
    {
        neutral: 0,
        happy: 8,
        sad: 8,
        angry: 9,
        fearful: 9,
        disgusted: 11,
        surprised: 16,
        userId: "ahmed3",
        createdAt: "125500"
      },
      {
          neutral: 10,
          happy: 11,
          sad: 12,
          angry: 13,
          fearful: 14,
          disgusted: 15,
          surprised: 16,
          userId: "ahmed4",
          createdAt: "125500"
        },

];


console.log(zees(initialData, initialData))

function objectifier (obj, result = [], index = 0){
  let acc = { neutral : [], happy : [], sad : [],angry : [],fearful : [], disgusted : [],surprised : []}

  if (obj.neutral.length === 0) {
    return result
  }
  for (var key in obj) {
    if (!obj[key]) {
      return;
    }
    acc[key] = obj[key].pop()
  }
  acc["userId"] = initialData[index]['userId']
  acc["createdAt"] = initialData[index]['createdAt']
  result.push(acc)

  index++

  objectifier (obj, result, index)
  return result
}

module.exports.zees = zees
