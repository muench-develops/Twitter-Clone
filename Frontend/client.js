//Form
const form = document.querySelector('form');
//loading gif
const loading = document.querySelector('.loading');
//Textarea
const textarea = document.querySelector('textarea');
//Char Counting
const counting = document.querySelector('.counting');
//Div, where the tweeties will be placed
const tweetieElement = document.querySelector('.tweeties');
//API_URL
const API_URL = 'http://127.0.0.1:9090/api/tweetie/'

//Showing Loading gif
loading.style.display = 'block'; 
//Get all Tweeties
listAllTweeties();

//Counts the chars
textarea.addEventListener("input", event => {
    const target = event.currentTarget;
    const maxLength = target.getAttribute("maxlength");
    const currentLength = target.value.length;
    if (currentLength >= maxLength) {
        //ToDo
        alert('Es sind maximal 280 Zeichen zulässig');
    }
    counting.textContent = `${currentLength} / ${maxLength} Zeichen`;
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const message = formData.get('Message');

    //Check for empty string and length
    if (!$("#Message").val() && message.length <= 280) {
        //ToDo
        alert("Eine Nachricht darf nicht leer sein und nicht mehr als 280 Zeichen beinhalten!");
    }
    else{
        //Show Loading and hide form
        loading.style.display = 'block'; 
        form.style.display = 'none'; 
        
        
        const tweetie = {
            message
        };
        
        //Sends data to API
        fetch(API_URL,{
            method: 'POST',
            body: JSON.stringify(tweetie),
            headers:{
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(createdTweetie => {
                console.log(createdTweetie)
                loading.style.display = 'none'; 
                form.style.display = 'block'; 
            });

        //reset Form
        form.reset();
        //Refresh all tweeties
        listAllTweeties();
    }  
});

//refresh all Tweeties
//user not implemented
function listAllTweeties(){

    fetch(API_URL).then(response => response.json())
        .then(tweeties => {
            tweeties.reverse();
            tweeties.forEach(element => {
                
                const div = document.createElement('div');
                div.setAttribute('class', 'my-3')
                const span_autor = document.createElement('p');
                span_autor.setAttribute('class', 'text-muted')
                span_autor.textContent = element.user + " " + element.date;
                const span_message = document.createElement('p');
                span_message.textContent = element.message;
                span_message.setAttribute('class', 'text-muted')
                div.appendChild(span_autor);
                div.appendChild(span_message);

                tweetieElement.appendChild(div);
            });
            loading.style.display='none';
    });


   

}
