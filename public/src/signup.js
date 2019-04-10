const signupForm = document.querySelector('.signup-form');
const database = firebase.database();

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    const name = signupForm['signup-user-name'].value;

    createUser(name, email, password)
})


function createUser(name, email, password){
    firebase.auth().createUserWithEmailAndPassword(email, password)
    
    .then(function (cred) {
        crateUserProfile(name, email, cred.user.uid);
        window.location = `feed.html?id=${cred.user.uid}`;
    })
    
    .catch(function (error) {
        console.log(error);
        if (error.code === 'auth/email-already-in-use') {
            $('#myModal').modal('show')
        }
    })
}

function crateUserProfile(name, email, uid) {
    database.ref('users/' + uid).set({
        name: name,
        email: email
    })
}

$('.btn-primary').click(function () {
    window.location = `login.html`;
})

$('.password-field').keyup(function (e) {
    if (e.target.value.length > 0 && e.target.value.length < 6) {
        $('.password-status').text('A senha deve ter mais de 6 caracteres')
    } else {
        $('.password-status').text('')
    }
})

$('.password-confirmation-field').keyup(function (e) {
    if (!checkPassword(e.target.value)) {
        $('.password-confirmation').text('As senhas não conferem')
    } else {
        $('.password-confirmation').text('')
    }
})

function checkPassword() {
    return $('.password-field').val() === $('.password-confirmation-field').val();
}
