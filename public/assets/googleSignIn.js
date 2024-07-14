
console.log('googleSignIn')

async function handleCredentialResponse(response) {
  // decodeJwtResponse() is a custom function defined by you
  // to decode the credential response.
  // const responsePayload = decodeJwtResponse(response.credential);
  // console.log(response.credential)

  // console.log("ID: " + responsePayload.sub);
  // console.log('Full Name: ' + responsePayload.name);
  // console.log('Given Name: ' + responsePayload.given_name);
  // console.log('Family Name: ' + responsePayload.family_name);
  // console.log("Image URL: " + responsePayload.picture);
  // console.log("Email: " + responsePayload.email);

  console.log(response.credential)
  const body = { googleToken: response.credential }

  try {
    const resp = await fetch('http://localhost:4000/api/auth/google', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
    const data = await resp.json()
    // console.log(data)
    localStorage.setItem('sub', data.sub)
  } catch (err) {
    console.warn(err)
    throw new Error('Error Internal Server.')
  }
}

document.querySelector('.btn-signout').addEventListener('click', () => {
  // console.log(google.accounts.id)
  google.accounts.id.disableAutoSelect()
  google.accounts.id.revoke( localStorage.getItem('sub'), done => {
    localStorage.clear()
    location.reload()
  })
})
