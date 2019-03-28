const database = firebase.database();
let USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function(){
    
    database.ref('questions/' + USER_ID).once('value')
        .then(function(snapshot){
            snapshot.forEach(function(childSnapshot){
                let childKey = childSnapshot.key;
                let childData = childSnapshot.val();
                $('.timeline').prepend(`
                    <div>
                        <span>${childData.text}</span>
                        <button data-questions-id=${childKey} > Excluir </button>
                    </div>
                `);  
                $(`button[data-questions-id='${childKey}']`).click(function(){
                    database.ref('questions/' + USER_ID + "/" + childKey).remove();
                    $(this).parent().remove();
                });              
            });
        });

    $('#form-post').submit(function(e){
        e.preventDefault();
        $('#buttonPost').attr('disabled', true);

        let newPost = $('.post').val(); 

        let questionsFromDB = database.ref('questions/' + USER_ID).push({
            text: newPost
        });

        $('.timeline').prepend(`
            <div>
                <span>${newPost}</span>
                <button data-questions-id=${questionsFromDB.key} >Excluir</button>
            </div>`);
    
        $(`button[data-questions-id=${questionsFromDB.key}]`).click(function(){
            $(this).parent().remove();
        });

        $('.post').val('');
    });

    $('.post').keyup(function(){
        if ($('.post').val == '') {
            $('#buttonPost').attr('disabled', true);
            return;
        }
        $('#buttonPost').attr('disabled', false);
    });
});



