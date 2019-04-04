
const signupForm = document.querySelector('.signup-form');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    const name = signupForm['signup-user-name'].value;

    firebase.auth().createUserWithEmailAndPassword(email, password).then(cred => {s
        crateUserProfile(name, email, cred.user.uid)
        window.location = `feed.html?id=${cred.user.uid}`;
    }).catch(function (error) {
        if (error.code === 'auth/email-already-in-use') {
            $('#myModal').modal('show')
        }
    })
})

function checkPassword() {
    return $('.password-field').val() === $('.password-confirmation-field').val();
}

function crateUserProfile(name, email, uid) {
    console.log("funciona")
    const database = firebase.database();
    const usersRef = database.ref(`users/${uid}`);

    usersRef.set({
        name: name,
        email: email
    })
}

$('.btn-primary').click(function () {
    window.location = `login.html`;
})