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

    let newPost = $('#post').val(); 
    let questionsFromDB = addQuestionsDB(newPost);

    createPost(questionsFromDB.key, newPost);
    deletePost(questionsFromDB.key);
    editPost(questionsFromDB.key);
};

function addQuestionsDB(text) {
    return database.ref(`questions/${USER_ID}`).push({
        text: text
    });
};

function buttonPost() {
    $('#post').keyup(function(){
        if ($('#post').val() == '') {
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
                editPost(childKey);          
            });
        });
};

function createPost(key, text) {
    $('#timeline').prepend(`
    <div class="container bg-white"> 
        <div class="row pt-3">
            <div class="media-block col-2 no-pad">
                <a href="#"><img class="img-circle img-sm rounded-circle" alt="Profile Picture" src="https://bootdey.com/img/Content/avatar/avatar1.png"></a>
                <div class="media-body">
                    <div class="mar-btm">
                    <a href="#" class="btn-link text-semibold d-flex justify-content-center">User</a>
                    </div>
                </div>
            </div>
            <div class="col-10">       
                <span data-text-id='${key}'>${text}</span>
            </div>
        </div>            
        <div class="pad-ver pull-right">
            <div class="btn-group">            
                <a class="btn btn-sm btn-default btn-hover-success" href="#"><i class="fa fa-thumbs-up"></i></a>
                <a class="btn btn-sm btn-default btn-hover-danger" href="#"><i class="fa fa-thumbs-down"></i></a>
            </div>
            <a class="btn btn-sm btn-default btn-hover-primary" href="#">Responder</a>
        </div>
        <button data-edit-id='${key}' data-ask="${text}" data-toggle='modal' data-target='#example-modal'> Editar</button>
        <button data-questions-id='${key}'> Excluir</button>
        <hr>
    </div>
    `)
    $('#post').val('');
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

function editPost(key) {
    $('#example-modal').on('show.bs.modal', function (event) {        
        var button = $(event.relatedTarget);

        var ask = button.data('ask');
        var dataEditId = button.data('editId');

        var modal = $(this);
        modal.find('.modal-input').val(ask);
        modal.find('.modal-key').val(dataEditId);
    });
    modalEventListener();
};

function modalEventListener() {
    
    $(`#modal-save`).click(function() {
        var modal = $('#example-modal');

        var newText = modal.find('.modal-input').val();
        var key = modal.find('.modal-key').val();

        $(`span[data-text-id=${key}]`).text(newText);

        database.ref(`questions/${USER_ID}/${key}`).update({
            text: newText
        });

        $(`button[data-edit-id=${key}]`).data('ask', newText);
        modal.modal('hide');
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
                editPost(childKey);          
            });
        });
};

function createPost(key, text) {
    $('#timeline').prepend(`
    <div class="container bg-white"> 
        <div class="row pt-3">
            <div class="media-block col-2 no-pad">
                <a href="#"><img class="img-circle img-sm rounded-circle" alt="Profile Picture" src="https://bootdey.com/img/Content/avatar/avatar1.png"></a>
                <div class="media-body">
                    <div class="mar-btm">
                    <a href="#" class="btn-link text-semibold d-flex justify-content-center">User</a>
                    </div>
                </div>
            </div>
            <div class="col-10">       
                <span data-text-id='${key}'>${text}</span>
            </div>
        </div>            
        <div class="pad-ver pull-right">
            <div class="btn-group">            
                <a class="btn btn-sm btn-default btn-hover-success" href="#"><i class="fa fa-thumbs-up"></i></a>
                <a class="btn btn-sm btn-default btn-hover-danger" href="#"><i class="fa fa-thumbs-down"></i></a>
            </div>
            <a class="btn btn-sm btn-default btn-hover-primary" href="#">Responder</a>
        </div>
        <button data-edit-id='${key}' data-ask="${text}" data-toggle='modal' data-target='#example-modal'> Editar</button>
        <button data-questions-id='${key}'> Excluir</button>
        <hr>
    </div>
    `)
    $('#post').val('');
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

// function editPost(key, text){
//     $(`button[data-edit-id='${key}']`).click(function(){
//         let newText =  prompt(`altere seu texto: ${text}`);
//         $(`span[data-text-id=${key}]`).text(newText);
//             database.ref(`questions/${USER_ID}/${key}`).update({
//             text: newText
//         });           
//     });
// };

function editPost(key) {
    $('#example-modal').on('show.bs.modal', function (event) {        
        var button = $(event.relatedTarget);

        var ask = button.data('ask');
        var dataEditId = button.data('editId');

        var modal = $(this);
        modal.find('.modal-input').val(ask);
        modal.find('.modal-key').val(dataEditId);
    });
};

function modalEventListener() {
    
    $(`#modal-save`).click(function() {
        var modal = $('#example-modal');

        var newText = modal.find('.modal-input').val();
        var key = modal.find('.modal-key').val();

        $(`span[data-text-id=${key}]`).text(newText);

        database.ref(`questions/${USER_ID}/${key}`).update({
            text: newText
        });

        $(`button[data-edit-id=${key}]`).data('ask', newText);
        modal.modal('hide');
    });
};
 
