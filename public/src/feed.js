window.onload = function () {
}

const database = firebase.database();
let USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function () {
    getQuenstionsDB();
    $('#form-post').submit(addQuestionsClick);
    buttonPost();
});

function addQuestionsClick(e) {
    e.preventDefault();
    $('#buttonPost').attr('disabled', true);

    let newPost = $('#post').val();
    let privacy = $('.privacy-select').val();
    let category = $('.category-select').val();
    let date = moment().format('D MMM YY');
    let questionsFromDB = addQuestionsDB(newPost, privacy, category, date, 0);
    getQuenstionsDB();
    deletePost(questionsFromDB.key);
    editPost(questionsFromDB.key);
};

function addQuestionsDB(text, privacy, category, date) {
    return database.ref(`questions/${USER_ID}`).push({
        text: text,
        privacy: privacy,
        category: category,
        date: date,
        likeCounter: 0
    });
};

function buttonPost() {
    $('#post').keyup(function () {
        if ($('#post').val() == '') {
            $('#buttonPost').attr('disabled', true);
            return;
        }
        $('#buttonPost').attr('disabled', false);
    });
};

function getQuenstionsDB() {
    let privacy = $('.filter-select').val();
    filtering(privacy).once('value')
        .then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                database.ref(`users/${USER_ID}`).once('value')
                .then(function (snapshot) {
                    let data = snapshot.val();
                    let name = data.name;
                    name = name.split(" ")[0];
                    let childKey = childSnapshot.key;
                    let childData = childSnapshot.val();
                    createPost(childKey, childData.text, childData.privacy, childData.category, childData.date, name, childData.likeCounter);
                    deletePost(childKey);
                    editPost(childKey);
                    likeDislike(childKey);
                });

            });
        });
};

function createPost(key, text, privacy, category, date, name, likeCounter) {

    $('#timeline').prepend(`
    <article class="media-block bg-white my-2" data-article='${key}'>
        <div class="d-flex">
            <figure class="p-3">
                <img class="rounded-circle img-circle" src="/assets/img/woman.png" alt="">
                <span class="user-name btn-link text-semibold d-flex justify-content-center">${name}</span>
            </figure>
            <div class="post-body w-100">
                <div class="header-post">
                    <header class="d-flex my-2 header-post justify-content-between">
                        <div class="d-flex">
                        <p class="text-muted text-sm filter">${privacy === 'public' ? `<i class="fas fa-globe-americas"></i>` : `<i class="fas fa-user-friends"></i>`} - ${date}</p>
                        <a class="category text-uppercase btn-sm">${category}</a>
                        </div>
                        <button type="button" class="btn btn-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true"aria-expanded="false"><i class="fas fa-chevron-down"></i></button>
                        <div class="dropdown-menu dropdown-menu-right pull-right" aria-labelledby="btnGroupDrop1">
                            <button class="dropdown-item edit-btn" data-edit-id='${key}' data-ask="${text}" data-toggle='modal' data-target='#example-modal'><i class="fas fa-edit"></i>Editar</button>
                            <button class="dropdown-item delete-btn" data-questions-id='${key}'><i class="fas fa-trash-alt"></i> Excluir</button>
                        </div>
                   </header>
                </div>
                <p class="post py-2" data-text-id='${key}'>${text}</p>
                <div class="btn-group pull-right m-2">            
                <a class="like" data-like-id='${key}'><i class="fas fa-thumbs-up"></i> 
                Like <input data-like-id='${key}' class="qty1" name="qty1" readonly="readonly" type="text" value= ${likeCounter}>
              </a>
            </div>
            </div>
        </div>
    </article>
    `)
    $('#post').val('');
};

function deletePost(key) {
    $(`button[data-questions-id=${key}]`).click(function (event) {
        let apagar = confirm('Deseja realmente excluir este registro?');
        if (apagar) {
            database.ref(`questions/${USER_ID}/${key}`).remove();
            $(`[data-article='${key}']`).remove();
        } else {
            event.preventDefault();
        }
    });
};

function editPost(key) {
    $('#example-modal').on('show.bs.modal', function (event) {
        let button = $(event.relatedTarget);

        let ask = button.data('ask');
        let dataEditId = button.data('editId');

        let modal = $(this);
        modal.find('.modal-input').val(ask);
        modal.find('.modal-key').val(dataEditId);
    });
    modalEventListener();
};

function modalEventListener() {

    $(`#modal-save`).click(function () {
        let modal = $('#example-modal');

        let newText = modal.find('.modal-input').val();
        let key = modal.find('.modal-key').val();

        $(`p[data-text-id=${key}]`).text(newText);

        database.ref(`questions/${USER_ID}/${key}`).update({
            text: newText
        });

        $(`button[data-edit-id=${key}]`).data('ask', newText);
        modal.modal('hide');
    });
};

function filtering(privacy) {

    let ref = firebase.database().ref(`questions/${USER_ID}`);
    $('#timeline').html('')

    if (privacy !== 'all') {
        return ref.orderByChild('privacy').equalTo(privacy);
    }
    return ref
}

$('.filter-select').change((e) => {
    getQuenstionsDB();
})

function getUser() {
    let name;
    database.ref(`users/${USER_ID}`).once('value')
        .then(function (snapshot) {
            let childData = snapshot.val();
            name = childData.name;
            console.log(name);
        });
};

function setUserName(name) {
    $('.user-name').text = name;
    console.log('aqui')
} 

function likeDislike (key) {
    $(`a[data-like-id='${key}']`).click(function(){
        let input = $(this).find('.qty1');
        let counter = parseInt(input.val())+ 1
        input.val(counter);
        database.ref(`questions/${USER_ID}/${key}`).update({likeCounter: counter}); 
    });
};