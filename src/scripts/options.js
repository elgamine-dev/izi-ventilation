import ext from "./utils/ext";
import storage from "./utils/storage";
import getProjects from "./utils/projects"
import clipboard from 'clipboard'

const debug = false

document.querySelector("#clear").addEventListener('click', function(){
  storage.remove('entries')
  bootstrap()
})

document.querySelector("#copy").addEventListener('click', function(){
  const content = document.querySelector('tbody#entries')
  const shadow = [...content.childNodes].map(row=>{
    row.childNodes[0].remove(); 
    return row.innerText
  }).join("")
  navigator.clipboard.writeText(shadow)
  bootstrap()
})

document.querySelector("#ventilation-update").addEventListener('click', function(){
  storage.set({ventilationURL:document.querySelector('[name=ventilation]').value})
  bootstrap()
})


function bootstrap() {

  getProjects( function(data) {
    const projects = data.projects
    if (!Array.isArray(projects) || projects.length === 0) {
      const txt = document.createTextNode("Aucune projet&nbsp;")
      return document.querySelector("#msg").appendChild(txt) 
    }
  });

  storage.get('ventilationURL', function(data) {
    document.querySelector(".lead a").setAttribute('href', data.ventilationURL)
  })

  storage.get('entries', function(data){
    const entries = data.entries
    
    const tbody = document.querySelector('tbody#entries')
    while(tbody.firstChild) {
      tbody.removeChild(tbody.firstChild)
    }
    
    if (!Array.isArray(entries) || entries.length === 0) {
      const txt = document.createTextNode("Aucune entree&nbsp;")
      return document.querySelector("#msg").appendChild(txt) 
    }
    for (let i=0; i<entries.length;i++){
      const tr = document.createElement('tr')
      
      const del = document.createElement('button')
      del.addEventListener('click', removeEntry.bind(null, i))
      const txt = document.createTextNode("×")
      del.appendChild(txt)

      addTd(tr, del)
      addTd(tr, entries[i].date)
      addTd(tr, entries[i].billed)
      addTd(tr, entries[i].project_name)
      addTd(tr, entries[i].time_spent)
      addTd(tr, entries[i].comment)

      tbody.appendChild(tr)
    }
  })

  if (debug) {
    storage.get('projects', function(data){
      console.log('projects', data)
      const txt = document.createTextNode(data.projects.join("\n"))
      
      document.querySelector('#projects').appendChild(txt)
    })
  }

}

function removeEntry(pos) {
  storage.get('entries', function(data){
    const entries = data.entries
    if (!Array.isArray(entries) || entries.length === 0) {

      const txt = document.createTextNode("Aucune entree&nbsp;")
      return document.querySelector("#msg").appendChild(txt) 
    }

    storage.set({entries:[
      ...entries.slice(0, pos), 
      ...entries.slice(pos+1)
    ]})
    bootstrap()
  })
}

function addTd(tr, value) {
  const td = document.createElement('td')
  if (typeof value === 'string') {
      value = document.createTextNode(value)
  } 
  td.appendChild(value)
  tr.appendChild(td)
}


function ProjectsUpdater() {
  var app = {
    field: document.querySelector('[name=projects_list]'),
    submit: document.querySelector('#refresh-projects'),
    init() {
      this.submit.addEventListener('click', this.updateProjects.bind(this))
    },
    updateProjects() {
      const projects = this.field.value.split("\n")
      storage.set({projects})
    }
  }

  return app
}


new ProjectsUpdater().init()
bootstrap()
