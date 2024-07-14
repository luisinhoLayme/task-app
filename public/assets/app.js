
console.log('hola')

const login = async () => {
  const user = {
    email: "madi@google.com",
    password: "Madicollins231"
  }
  try {

    const data = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })
    const res = await data.json()
    console.log(res)
  } catch (err) {
    console.log(err)
  }
}

const restApi = async () => {
  try {

    const data = await fetch('http://localhost:4000/api/tasks?page=1')
    const res = await data.json()
    console.log(res)
  } catch (err) {
    console.log(err)
  }
}

const buttonLogin = document.querySelector('.btn-login')
buttonLogin.addEventListener('click', login)
document.querySelector('.btn-tasks').addEventListener('click', restApi)

