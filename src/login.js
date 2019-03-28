$('.submit-button').click(function () {
    let userEmail = document.querySelector('.email').value;
    let password = document.querySelector('.password').value;

    firebase.auth().signInWithEmailAndPassword(userEmail, password)
        .then(function (response) {
            window.location = "feed.html?id=" + response.user.uid;
        })
        .catch(function (error) {
            window.alert('Error: ' + error.code);
        })
})

$('.botao').click(function () {
    firebase.auth().signOut().then(function () {
        window.alert('SignOut sucessfull!');
        document.getElementById('logged').style.display = 'hide';

    }), function (error) {
        window.alert(error.code);
    }
})

$('.google-auth').click(function () {
    base_provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(base_provider).then(function (response) {
        window.location = "feed.html?id=" + response.user.uid;
        console.log('Success')
    }).catch(function (error) {
        console.log(error)
    })
})

window.fbAsyncInit = function () {
    FB.init({
        appId: '{your-app-id}',
        cookie: true,
        xfbml: true,
        version: '{api-version}'
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