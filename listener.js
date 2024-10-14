const app = require("./app");

app.listen(8080, (err) => {
    if (err) {
        console.log("Server is down", err); 
    } else {
    console.log ("Server is listening on port:8080...");
    }
});