// make connection
const socket = io.connect('http://localhost:4000');
let wordCount = []
// query dom
let message = document.getElementById('message')
let handle = document.getElementById('handle')
let btn = document.getElementById('send')
let output = document.getElementById('output')
let feedback = document.getElementById('feedback');
let mostWords = document.getElementById('mostWords');

// emit events
btn.addEventListener('click', _ => {
    // emit the message through the sockets. Two paramers: first is the name of the message, the second is the data we're sending to the server.
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    })
})
message.addEventListener('keypress', _ => {
    socket.emit('typing', handle.value);
})
let keys = [];
// listen to the send events
socket.on('chat', data => {
    let tokens = data.message.split(/\W+/);
    for (let i = 0; i < tokens.length; i++) {
        let word = tokens[i].toLowerCase();
        if (!/\d+/.test(word)) {
            if (wordCount[word] === undefined) {
                wordCount[word] = 1;
                keys.push(word)
            } else {
                wordCount[word] = wordCount[word] + 1;
            }
        }
    }
   keys.sort(compare);
//    sort the array based on the comparison that you give it
   function compare(a, b){
    var countA = wordCount[a];
    var countB = wordCount[b];
    return countB - countA
   }
   for (let i = 0; i < keys.length; i++) {
       let key = keys[i];
       console.log(key + " " + wordCount[key])
   }
    let topWords = keys.slice(0, 5);
    console.log("topWords", topWords)
    feedback.innerHTML = '';
    mostWords.innerHTML = '';


    topWords.forEach(el => {
       const markup =
       ` <li>${el}</li> `
        mostWords.insertAdjacentHTML("beforeend", markup)
    });

    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';

})
socket.on('typing', data => {
    feedback.innerHTML = '<p><em>' + data + ' is aan het typen...</em></p>';
})

socket.on('broadcast', function(data){
    let countTag = document.getElementById("Count");
    countTag.innerHTML = data
})