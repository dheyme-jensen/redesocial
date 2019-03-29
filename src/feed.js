const database = firebase.database();
let USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function(){    
    getQuenstionsDB();
    $('#form-post').submit(addQuestionsClick);
    buttonPost();
});

function addQuestionsClick(e) {
    e.preventDefault();    
    $('#buttonPost').attr('disabled', true);

    let newPost = $('.post').val(); 
    let questionsFromDB = addQuestionsDB(newPost);

    createPost(questionsFromDB.key, newPost);
    deletePost(questionsFromDB.key);
    editPost(questionsFromDB.key, newPost);
};

function addQuestionsDB(text) {
    return database.ref(`questions/${USER_ID}`).push({
        text: text
    });
};

function buttonPost() {
    $('.post').keyup(function(){
        if ($('.post').val == '') {
            $('#buttonPost').attr('disabled', true);
            return;
        }
        $('#buttonPost').attr('disabled', false);
    });
};

function getQuenstionsDB() {
    database.ref(`questions/${USER_ID}`).once('value')
        .then(function(snapshot){
            snapshot.forEach(function(childSnapshot){
                let childKey = childSnapshot.key;
                let childData = childSnapshot.val();
                createPost(childKey, childData.text);
                deletePost(childKey);
                editPost(childKey, childData.text);          
            });
        });
};

function createPost(key, text) {
    $('.timeline').prepend(`
            <div>
                <span data-text-id='${key}'>${text}</span>
                <button data-questions-id='${key}'> Excluir</button>
                <button data-edit-id='${key}'> Editar</button>
            </div>
        `)
    $('.post').val('');
};  

function deletePost(key){
    $(`button[data-questions-id=${key}]`).click(function(event) {
        let apagar = confirm('Deseja realmente excluir este registro?');
        if (apagar){
            database.ref(`questions/${USER_ID}/${key}`).remove();
            $(this).parent().remove();      		
        }else{
            event.preventDefault();
        }
    });
};

function editPost(key, text){
    $(`button[data-edit-id='${key}']`).click(function(){
        let newText =  prompt(`altere seu texto: ${text}`);
        $(`span[data-text-id=${key}]`).text(newText);
            database.ref(`questions/${USER_ID}/${key}`).update({
            text: newText
        });           
    });
};

