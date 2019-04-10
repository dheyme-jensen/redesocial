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

$('.google-auth').click(function () {
    base_provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(base_provider)
        .then(function (response) {
            window.location = "feed.html?id=" + response.user.uid;
        })
        .catch(function (error) {
            console.log(error)
        })
})

window.fbAsyncInit = function () {
    FB.init({
        appId: '415264915702182',
        cookie: true,
        xfbml: true,
        version: 'v2.8'
    });

    FB.AppEvents.logPageView();
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

$('.facebook-auth').click(function () {
    base_provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(base_provider).then(function (response) {
        window.location = "feed.html?id=" + response.user.uid;
        console.log('Success')
    }).catch(function (error) {
        console.log(error)
    })
})

$('.password-field').keyup(() => {
    $('.password-error').text('');
})

$('.email').keyup(() => {
    $('.email-error').text('');
})