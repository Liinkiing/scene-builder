const API_URL = 'https://builderama-api.herokuapp.com/api'

class ApiWrapper {
  constructor () {
    this.url = null
    this.endpoint = null
    this.headers = new Headers()
    this.headers.append('Content-Type', 'application/json')
    this.headers.append('Accept', 'application/json')
  }

  prepare (endpoint) {
    this.endpoint = endpoint
    this.url = API_URL + '/' + this.endpoint
  }

  get (endpoint) {
    this.prepare(endpoint)
    this.request = new Request(this.url, {
      method: 'GET',
      headers: this.headers
    })
    return fetch(this.request)
      .then(response => {
        if (!response.ok) throw Error(response.statusText)
        return response.json()
      })
  }

  post (endpoint, data) {
    this.prepare(endpoint)
    this.request = new Request(this.url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    })
    return fetch(this.request)
      .then(response => {
        if (!response.ok) throw Error(response.statusText)
        return response.json()
      })
  }
}

export let apiWrapper = new ApiWrapper()
