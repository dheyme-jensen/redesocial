const database = firebase.database();
let USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function(){
    
    database.ref(`questions/${USER_ID}`).once('value')
        .then(function(snapshot){
            snapshot.forEach(function(childSnapshot){
                let childKey = childSnapshot.key;
                let childData = childSnapshot.val();
                $('.timeline').prepend(`
                    <div>
                        <span data-text-id='${childKey}'>${childData.text}</span>                                               
                        <button data-questions-id='${childKey}'> Excluir </button>
                        <button data-edit-id='${childKey}'> Editar</button>
                    </div>
                `);               
                
                $(`button[data-questions-id='${childKey}']`).click(function(){
                    let apagar = confirm('Deseja realmente excluir este registro?');
                    if (apagar){
                        database.ref(`questions/${USER_ID}/${childKey}`).remove();
                        $(this).parent().remove();      		
                    }else{
                        event.preventDefault();
                    }
                });
                    
                $(`button[data-edit-id='${childKey}']`).click(function(){
                    let newText =  prompt(`altere seu texto: ${childData}`);
                    $(`span[data-text-id=${childKey}]`).text(newText);
                    
                    database.ref(`questions/${USER_ID}/${childKey}`).update({
                        text: newText
                    });
                });        
            });
        });

    $('#form-post').submit(function(e){
        e.preventDefault();
        $('#buttonPost').attr('disabled', true);

        let newPost = $('.post').val(); 

        let questionsFromDB = database.ref(`questions/${USER_ID}`).push({
            text: newPost
        });

        $('.timeline').prepend(`
            <div>
                <span data-text-id='${questionsFromDB.key}'>${newPost}</span>
                <button data-questions-id='${questionsFromDB.key}'> Excluir</button>
                <button data-edit-id='${questionsFromDB.key}'> Editar</button>
            </div>
        `);
      
        $(`button[data-questions-id=${questionsFromDB.key}]`).click(function(event) {
            let apagar = confirm('Deseja realmente excluir este registro?');
            if (apagar){
                database.ref(`questions/${USER_ID}/${questionsFromDB.key}`).remove();
                $(this).parent().remove();      		
            }else{
                event.preventDefault();
            }	
        });
    
        $(`button[data-edit-id='${questionsFromDB.key}']`).click(function(){
           let newText =  prompt(`altere seu texto: ${newPost}`);
           $(`span[data-text-id=${questionsFromDB.key}]`).text(newText);
           database.ref(`questions/${questionsFromDB.key}`).update({
               newPost: newText
           });
           
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



