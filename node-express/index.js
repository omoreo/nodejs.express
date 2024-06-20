//frontend
const BASE_URL = 'http://localhost:8000'

let mode = 'CREAETE' //default
let selectedId = ''

window.onload = async() => {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    if(id) {
        mode = 'EDIT'
        selectedId = id

        //put data user old
        try {
            const response = await axios.get(`${BASE_URL}/users/${id}`)
            // console.log('data', response.data)
            const user = response.data

            // user data callback
            let firstNameDOM = document.querySelector('input[name=firstname]')
            let lastNameDOM = document.querySelector('input[name=lastname]')
            let ageDOM = document.querySelector('input[name=age]')
            let descriptionDOM = document.querySelector('textarea[name=description]')

            firstNameDOM.value = user.firstname
            lastNameDOM.value = user.lastname
            ageDOM.value = user.age
            descriptionDOM.value = user.description
  
            let genderDOMs = document.querySelectorAll('input[name=gender]')
            let interestDOMs = document.querySelectorAll('input[name=interest]')
            
            for(let i = 0; i < genderDOMs.length; i++){
                if(genderDOMs[i].value == user.gender){
                    genderDOMs[i].checked = true
                }
            }

            for(let i = 0; i < interestDOMs.length; i++){
                if(user.interests.includes(interestDOMs[i].value)){
                    interestDOMs[i].checked = true
                }
            }

        } catch(error) {
            console.log('error', error);
        }
        // update user 
    }
}

const validateData = (userData) => {
    let errors = []

    if(!userData.firstname){
        errors.push('Please Enter Your Firstname')
    }

    if(!userData.lastname){
        errors.push('Please Enter Your Lastname')
    }

    if(!userData.age){
        errors.push('Please Enter Your Age')
    }

    if(!userData.gender){
        errors.push('Please Select Your Gender')
    }

    if(!userData.interests){
        errors.push('Please Select Interest')
    }

    if(!userData.description){
        errors.push('Please Enter Your Description')
    }


    return errors
}

const submitData = async() => {
    let firstNameDOM = document.querySelector('input[name=firstname]')
    let lastNameDOM = document.querySelector('input[name=lastname]')
    let ageDOM = document.querySelector('input[name=age]')
  
    let genderDOM = document.querySelector('input[name=gender]:checked') || {}
    let interestDOMs = document.querySelectorAll('input[name=interest]:checked') || {}
   
    let descriptionDOM = document.querySelector('textarea[name=description]')

    let messageDOM = document.getElementById('message')
  
    try {
        let interest = ''
    
        for (let i = 0; i < interestDOMs.length; i++) {
        interest += interestDOMs[i].value
        if (i != interestDOMs.length - 1) {
            interest += ', '
        }
        }
    
        let userData = {
        firstname: firstNameDOM.value,
        lastname: lastNameDOM.value,
        age: ageDOM.value,
        gender: genderDOM.value,
        description: descriptionDOM.value,
        interests: interest
        }

        console.log('submit data', userData);

        // const errors = validateData(userData);
        // if(errors.length > 0){
        //     throw {
        //         message: 'Please Enter Data',
        //         errors: errors
        //     }
        // }
    
        let mesasge = 'Save Complete'

        if(mode == 'CREATE'){
            const response = await axios.post(`${BASE_URL}/users`, userData)
            console.log('response', response.data);
        } else {
            const response = await axios.put(`${BASE_URL}/users/${selectedId}`, userData)
            mesasge = 'Edit Complete'
            console.log('response', response.data);
        }

        // console.log('response', response.data)

        messageDOM.innerText = mesasge
        messageDOM.className = 'message success'

    } catch (error) {
        console.log('error message', error.message)
        console.log('error', error.errors)
        if(error.response){
            console.log(error.response);
            error.message = error.response.data.message
            error.errors = error.response.data.errors
        }

        let htmlData = '<div>'
        htmlData += `<div>${error.message}</div>` //template eternal
        htmlData += '<ul>'
        for(let i = 0; i  < error.errors.length; i++){
            htmlData += `<li>${error.errors[i]}</li>`
        }
        htmlData += '</ul>'
        htmlData += '</div>'

            messageDOM.innerHTML = htmlData
            messageDOM.className = 'message danger'
    }
  }