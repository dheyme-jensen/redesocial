const database = firebase.database();

$('.signup-button').click(function (e) {
    e.preventDefault();

    let userEmail = $('.email').val();
    let password = $('.password-field').val();

    firebase.auth().signInWithEmailAndPassword(userEmail, password)
        .then(function (response) {
            window.location = "feed.html?id=" + response.user.uid;
        })
        .catch(function (error) {
            getError(error.code)
        })
})

function getError(error) {
    if (error === 'auth/wrong-password') {
        $('.password-error').text('Senha incorreta');
    } else if (error === 'auth/user-not-found') {
        $('.email-error').text('E-mail não cadastrado');
    }
}

$('.google-auth').click(function (e) {
    e.preventDefault();
    base_provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(base_provider)
        .then(function (response) {
            crateUserProfile(response.user.displayName,  response.user.uid); 
            window.location = "feed.html?id=" + response.user.uid;
        })
        .catch(function (error) {
            console.log(error)
        })
})

$('.password-field').keyup(() => {
    $('.password-error').text('');
})

$('.email').keyup(() => {
    $('.email-error').text('');
})

function crateUserProfile(name, uid) {
    database.ref('users/' + uid).set({
        name: name
    })
}