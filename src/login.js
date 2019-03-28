
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        document.getElementById('logged').style.display = 'block';
        document.querySelector('.botao').style.display = 'block';
        document.getElementById('logged').innerHTML = `You are current logged in ${user.value}`
    }
    else {
        document.getElementById('logged').style.display = 'hide';
        document.querySelector('.botao').style.display = 'hide';
    }
})

/* document.querySelector('.submit-button').addEventListener('click', function () {
    let userEmail = document.querySelector('.email').value;
    let password = document.querySelector('.password').value;

    firebase.auth().signInWithEmailAndPassword(userEmail, password).catch(function (error) {
        window.alert('Error: ' + error.code);
    })
}) */

 $('.submit-button').click(function () {
    let userEmail = document.querySelector('.email').value;
    let password = document.querySelector('.password').value;

    firebase.auth().signInWithEmailAndPassword(userEmail, password)
    .then(function(response){
        window.location = "feed.html?id=" + response.user.uid; 
    })
    .catch(function (error) {
        window.alert('Error: ' + error.code);
    })
})
 
/* document.querySelector('.botao').addEventListener('click', function(){
    firebase.auth().signOut().then(function(){
        window.alert('SignOut sucessfull!')
    }), function (error){
        window.alert(error.code);
    }
}) */

$('.botao').click(function () {
    firebase.auth().signOut().then(function () {
        window.alert('SignOut sucessfull!');
        document.getElementById('logged').style.display = 'hide';

    }), function (error) {
        window.alert(error.code);
    }
})