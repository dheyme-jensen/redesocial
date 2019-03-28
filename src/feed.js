const database = firebase.database();
let USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(() => {
    
    database.ref('questions/' + USER_ID).once('value')
        .then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                let childKey = childSnapshot.key;
                let childData = childSnapshot.val();
                $('#timeLine').prepend(`
                    <div>
                        <span>${childData.text}</span>
                        <button data-questions-id=${childKey}> Excluir</button>
                    </div>
                `);  
                $(`button[data-questions-id='${childKey}']`).click(() => {
                    $(this).parent().remove();
                }); 
                             
            });
        });

    $('#form-post').submit((e) => {
        e.preventDefault();
        $('#buttonPost').attr('disabled', true);

        let newPost = $('#post').val(); 

        let questionsFromDB = database.ref('questions/' + USER_ID).push({
            text: newPost
        });

        $('#timeLine').prepend(`
            <div>
                <span data-text-id="${questionsFromDB.key}">${newPost}</span>
                <button data-delete-id="${questionsFromDB.key}"> Excluir</button>
                <button data-edit-id="${questionsFromDB.key}"> Editar</button>
            </div>
        `);
    
        $(`button[data-delete-id=${questionsFromDB.key}]`).click(function(){
            $(this).parent().remove();
            database.ref('questions/' + questionsFromDB.key).remove();
        });
        $('#post').val('');

        $(`button[data-edit-id='${questionsFromDB.key}']`).click(function(){
           let newText =  prompt(`altere seu texto: ${newPost}`);
           $(`span[data-text-id=${questionsFromDB.key}]`).text(newText);
           database.ref('questions/' + questionsFromDB.key).update({
               newPost: newText
           });
           
        });
    });

    $('#post').keyup(() => {
        if ($('#post').val == '') {
            $('#buttonPost').attr('disabled', true);
            return;
        }
        $('#buttonPost').attr('disabled', false);
    });
});



