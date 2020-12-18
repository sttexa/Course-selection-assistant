/**
 * Created by DELL on 2020/4/3.
 */

// Testing file for connection and operation to database.
// The following database name, collection name and data structure are different from the real data. They are just examples.
// The following code has been executed correctly, which means there is no error in the connection and operation to database.
// You can write testing file like this.

const mongodbClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017";
mongodbClient.connect(url, (err, client) => {
    if (err) {
        console.log("success");
    } else {
        console.log("fail");
    }

    if (!err) {
        const collection = client.db("unittestdb").collection("unit"); //DO NOT forget to change the database name and collection name
        collection.save({ //All following data is just sample, not the real data
            name: "Capstone",
            code: "COMP5703"
        }, (err, result) => {
            client.close()
        })

        collection.save({
            name: "Professional Practice in IT",
            code: "INFO5992"
        }, (err, result) => {
            client.close()
        })

        collection.remove({
            name: "Capstone"
        }, () => {
            client.close();
        })

        collection.update({
            name: "Professional Practice in IT"
        }, {
            $set: {code: "INFO5990"}
        }, () => {
            client.close();
        })
    }
})
