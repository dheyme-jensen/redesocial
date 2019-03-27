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
                        <input type='button' value='Excluir' data-task-id=${childKey} />
                    </div>
                `);  
                $(`input[data-task-id='${childKey}']`).click(() => {
                    $(this).parent().remove();
                });              
            });
        });

    $('#form-post').submit((e) => {
        e.preventDefault();
        $('#buttonPost').attr('disabled', true);

        let newPost = $('#post').val(); 

        let taskFromDB = database.ref('questions/' + USER_ID).push({
            text: newPost
        });

        $('#timeLine').prepend(`
            <div>
                <span>${newPost}</span>
                <input type='button' value='Excluir' data-task-id=${taskFromDB.key} />
            </div>
        `);
    
        $(`input[data-task-id='${taskFromDB.key}']`).click(() => {
            $(this).closest('div').remove();
        });
        $('#post').val('');
    });

    $('#post').keyup(() => {
        if ($('#post').val == '') {
            $('#buttonPost').attr('disabled', true);
            return;
        }
        $('#buttonPost').attr('disabled', false);
    });
});



