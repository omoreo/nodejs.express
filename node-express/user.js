const BASE_URL = 'http://localhost:8000'

window.onload = async() => {
    await loadData()
}

const loadData = async () => {
    console.log("on load");
    // load all user from api
    const response = await axios.get(`${BASE_URL}/users`)

    console.log(response.data);

    const userDOM = document.getElementById('user')
    let htmlData = '<div>'
    // load user in html
    for(let i = 0; i < response.data.length; i++){
        let user = response.data[i]
        htmlData += `<div>
                        ${user.id}. ${user.firstname} ${user.lastname}
                        <a href="index.html?id=${user.id}"><button>Edit</button></a> <!-- ?id={user.id} query param -->
                        <button class='delete' data-id='${user.id}'>Delete</button>
                    </div>`
    }

    htmlData += '</div>'
    userDOM.innerHTML = htmlData

    //button class='delete' <<<
    const deleteDOMs = document.getElementsByClassName('delete')

    for(let i = 0; i < deleteDOMs.length; i++){
        deleteDOMs[i].addEventListener('click', async(event) => {
            // put id 
            const id = event.target.dataset.id
            try {
                await axios.delete(`${BASE_URL}/users/${id}`)
                loadData() // recursive func = call func urself
            } catch (error) {
                console.log('error',  error);
            }
        })
    }
}