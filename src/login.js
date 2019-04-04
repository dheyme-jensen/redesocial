$('#botao').click(function() {
    let userEmail = document.querySelector('.email').value;
    let password = document.querySelector('.password-field').value;
    console.log('im still out')

    firebase.auth().signInWithEmailAndPassword(userEmail, password)
        .then(function (response) {
            console.log('im here')
            window.location = "feed.html?id=" + response.user.uid;
            console.log('i passed')
        }), (function (error) {
            if (error.code === 'auth/account-exists-with-different-credential') {
                $('#myModal').modal('show')
            }
            window.alert('Error: ' + error.code);
        })
})

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