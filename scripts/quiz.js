let currentQuestion = 0;
sessionStorage.clear();

loadQuestion();

$('#number-of-question').text(quiz.length);

// progress
const progress = $('.progress');
progress.empty();
quiz.forEach(question => {
    const progress_el = $('<div></div>', {class : 'progress-el'});
    progress.append(progress_el);
})

function loadQuestion(){
    const question = quiz[currentQuestion];

    $('#current-question').text(currentQuestion + 1);
    $('.question').text(question.question);
    const answers = $('.answers');
    answers.empty();
    
    question.answers.forEach((answer, index) => {
        const answer_el = $(`<label for=${index}><input type="radio" name="answer" id =${index}>${answer}</label>`);
        answers.append(answer_el);
    });

    const response = sessionStorage.getItem(currentQuestion);
    if(response){
        $('.answers input:eq(0)').prop('checked', true);
        progress.find(`div:eq(${currentQuestion})`).addClass('selected');
    }
    
    
    
    if(currentQuestion === quiz.length - 1){
        $('.btn-next').hide();
        $('.btn-submit').show();
    }else {
        $('.btn-next').show();
        $('.btn-submit').hide();
    }

}

function updateProgressBar(){
    progress.find('div').eq(currentQuestion).addClass('selected');
}

function validateResponse(){
    const radio_btns =  $('.answers input[name=answer]');
    const radio_index = radio_btns.index(radio_btns.filter(':checked'));
    
    if(radio_index > -1){   
        // save response into session storage
        sessionStorage.setItem(currentQuestion, radio_index);
        progress.find(`div:eq(${currentQuestion})`).addClass('selected');
        return true;
    }
    alert('Vous devez choisir une réponse!');
    return false;
}

$('.btn-next').click( () => {
    if(!validateResponse()) return;

    if(currentQuestion + 1< quiz.length){
        ++currentQuestion;
        loadQuestion();    
    }
})

$('#btn-back').click( ()=> {
    if(currentQuestion - 1>= 0){
        --currentQuestion
        loadQuestion();
    }
})

$('.btn-submit').click( ()=> {
    if(!validateResponse()) return;
    let rCorrectes = 0;
    quiz.forEach( (question, index) => {
        const s = sessionStorage.getItem(index);
        if(question.correct == s) rCorrectes++;
    })

    const out = `<div class="result">
    <div class=""><div class="value">${quiz.length}</div><div class="title">Nombre de questions</div></div>
    <div class=""><div class="value">${rCorrectes}</div><div class="title">Réponses correctes</div></div>
    <div class=""><div class="value">${rCorrectes*100/quiz.length}%</div><div class="title">Pourcentage de réussite</div></div></div>
    <button class="btn" type= "submit" onClick= "window.location.reload()">Reset</button>`;
    $('.quiz').html(out);
})

