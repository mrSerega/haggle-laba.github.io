const KNN = require('ml-knn');
const csv = require('csvtojson');
const prompt = require('prompt');
let knn;
var path = require("path");
//const csvFilePath = 'iris.csv'; // Data
const csvFilePath = 'gapp.csv'; // Data
//const names = ['sepalLength', 'sepalWidth', 'petalLength', 'petalWidth', 'type']; // For header
const names = ['app', 'category', 'rating', 'reviews', 'size', 'installs', 'type', 'price', 'content rating', 'genres', 'last update', 'current ver', 'android var']; // For header

let seperationSize; // To seperate training and test data

let data = [],
    X = [],
    y = [];

let trainingSetX = [],
    trainingSetY = [],
    testSetX = [],
    testSetY = [];

const express = require('express')
const app = express()
const port = 3000

app.use('/index.html', express.static(__dirname + '/index.html'));
app.use('/js/draw.js', express.static(__dirname + '/js/draw.js'));
app.use('/js/Chart.min.js', express.static(__dirname + '/js/Chart.min.js'));

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
})

var errors = [];
console.log('OK OK OK')

csv({
    noheader: true,
    headers: names
}, errors)
    .fromFile(csvFilePath)
    .on('json', (jsonObj) => {

        briefObj = {
            'reviews': parseFloat(jsonObj.reviews),
            'installs': parseFloat(jsonObj.installs.slice(0, jsonObj.installs.length - 1)),
            'price': parseFloat(jsonObj.price),
            'rating': parseFloat(jsonObj.rating),
            'type': jsonObj.category // required field
        }

        //  console.log(briefObj.type)

        data.push(briefObj); // Push each object to data Array
    })
    .on('done', (error) => {
        seperationSize = 0.7 * data.length;
        data = shuffleArray(data);
        dressData(errors);
    });

console.log(error)

function dressData(errors) { //																				<----

    /**
     * There are three different types of Iris flowers
     * that this dataset classifies.
     *
     * 1. Iris Setosa (Iris-setosa)
     * 2. Iris Versicolor (Iris-versicolor)
     * 3. Iris Virginica (Iris-virginica)
     *
     * We are going to change these classes from Strings to numbers.
     * Such that, a value of type equal to
     * 0 would mean setosa,
     * 1 would mean versicolor, and
     * 3 would mean virginica
     */

    let types = new Set(); // To gather UNIQUE classes

    data.forEach((row) => {
        types.add(row.type);
    });

    typesArray = [...types]; // To save the different types of classes.

    data.forEach((row) => {
        let rowArray, typeNumber;

        rowArray = Object.keys(row).map(key => parseFloat(row[key])).slice(0, 4);

        typeNumber = typesArray.indexOf(row.type); // Convert type(String) to type(Number)

        X.push(rowArray);
        y.push(typeNumber);
    });

    trainingSetX = X.slice(0, seperationSize);
    trainingSetY = y.slice(0, seperationSize);
    testSetX = X.slice(seperationSize);
    testSetY = y.slice(seperationSize);

    for (let i = 0; i < testSetX.length; i++) { // 																	< ----
        console.log('*** ', i, ' ***');
        train(i + 1, errors); // 																										<---
    }

    //    console.log(errors); // 																												< -------
}

function train(k, errors) { // <-----
    knn = new KNN(trainingSetX, trainingSetY, {
        k
    }); //															<------
    test(errors); //<------
}

function test(errors) { //																															<------
    const result = knn.predict(testSetX);
    // console.log('result', result)
    const testSetLength = testSetX.length;
    const predictionError = error(result, testSetY);
    errors.push(predictionError); // 																									<-------
    // console.log(`Test Set Size = ${testSetLength} and number of Misclassifications = ${predictionError}`);
    // predict();
}

function error(predicted, expected) {
    let misclassifications = 0;
    for (var index = 0; index < predicted.length; index++) {
        if (predicted[index] !== expected[index]) {
            misclassifications++;
        }
    }
    return misclassifications;
}

function predict() {
    let temp = [];
    prompt.start();

    prompt.get(['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'], function (err, result) {
        if (!err) {
            for (var key in result) {
                temp.push(parseFloat(result[key]));
            }
            console.log(`With ${temp} -- type =  ${knn.predict(temp)}`);
        }
    });
}

/**
 * https://stackoverflow.com/a/12646864
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

app.get('/', function (req, res) {

    res.sendFile(path.join(__dirname + '/hello.html'));

});

app.get('/hello', function (req, res) {
    console.log('hello was requested')
})

app.post('/index', function (req, res) {
    console.log('index was requested')
    console.log('POST POST POST', errors);
    res.send({
        err: errors.map((value, index) => ({
            "x": index + 1,
            "y": value / errors.length * 100
        }))
    })
})

app.post('/redraw', function (req, res) {
    console.log('redraw requested')
    errors = [];
    data = [],
        X = [],
        y = [];

    trainingSetX = [],
        trainingSetY = [],
        testSetX = [],
        testSetY = [];
    csv({
        noheader: true,
        headers: names
    }, errors)
        .fromFile(csvFilePath)
        .on('json', (jsonObj) => {
            briefObj = {
                'reviews': parseFloat(jsonObj.reviews),
                'installs': parseFloat(jsonObj.installs.slice(0, jsonObj.installs.length - 1)),
                'price': parseFloat(jsonObj.price),
                'rating': parseFloat(jsonObj.rating),
                'type': jsonObj.category // required field
            }

            //  console.log(briefObj.type)

            data.push(briefObj); // Push each object to data Array
        })
        .on('done', (error) => {
            seperationSize = 0.7 * data.length;
            data = shuffleArray(data);
            dressData(errors); //
            res.send({
                err: errors.map((value, index) => ({
                    "x": index + 1,
                    "y": value / errors.length * 100
                }))
            })
        });

})