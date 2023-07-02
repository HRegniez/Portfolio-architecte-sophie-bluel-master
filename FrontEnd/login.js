const mailInput = document.querySelector('#mail')
const passwordInput = document.querySelector('#password')
const form = document.querySelector('#form')
const logInOut = document.querySelector('#login')  

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const response = await requestLogin(mailInput, passwordInput)
    checkLogin(response)
})

async function checkLogin(response) {
    if(response === undefined){
        const errorMessage = document.createElement('p')
        errorMessage.innerHTML = `
            Erreur dans l’identifiant ou le mot de passe
        `
        errorMessage.classList.add('login_error')
        form.appendChild(errorMessage)
    }else{
        window.localStorage.setItem("userId", response.userId)
        window.localStorage.setItem("token", response.token)
        console.log(localStorage)
        window.location.href = "./index.html"
    }
}

async function requestLogin(mailInput, passwordInput){
    try {
        const req = await fetch('http://localhost:5678/api/users/login', {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                'email': mailInput.value,
                'password': passwordInput.value
            })
            
        })
        if(!req.ok) {
            throw new Error('login request failed')
        }
        resp = await req.json()    
        return resp
    } catch (error) {
        console.error(error)
    }   
}
