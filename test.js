const data = [{ id: '182e4e50d5ef8331', data: 'Is it working?', sender: '<team@mail.notion.so>' }]
var newData = `Sender: ${data[0].sender}\nMessage: ${data[0].data}`
console.log(newData)