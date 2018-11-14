import ext from "./utils/ext";
import storage from "./utils/storage";
//import "./utils/stretchy"

var projectsReporter = function () {

  var app = {
    data: {
      projects:[]
    },
    inputs: {
      project_name: document.querySelector('[name=project_name]'),
      time_spent: document.querySelector('[name=time_spent]'),
      date: document.querySelector('[name=date]'),
      billed: document.querySelector('[name=billed]'),
      comment: document.querySelector('[name=comment]'),
      submit: document.querySelector('[name=add]')
    },
    init(projects) {
      this.data.projects = projects
      this.setDefaults()
      this.inputs.submit.addEventListener('click', this.onAdd.bind(this))
    },
    onAdd() {
      const data = {
        project_name: this.inputs.project_name.value,
        time_spent: this.inputs.time_spent.value,
        comment: this.inputs.comment.value,
        billed: this.inputs.billed.checked && 'Temps facturé' || 'Temps non facturé',
        date: this.inputs.date.value,
      }
      storage.get('entries', (ent)=>{
        const altered = 
        Array.isArray(ent.entries) 
        && [...ent.entries, data] 
        || [data]
        storage.set({entries: altered})
      })

      this.alert()

    },
    setDefaults() {
      this.inputs.date.valueAsDate = new Date()
      this.inputs.time_spent.value = 3.5
      for(let i = 0; i < this.data.projects.length; i++) {
        const opt = document.createElement('option');
        opt.value = this.data.projects[i];
        const txt = document.createTextNode(this.data.projects[i])
        opt.appendChild(txt);
        this.inputs.project_name.appendChild(opt)
      }
      this.inputs.project_name.appendChild(document.createElement('option'))

    },
    alert(){
      const projects = document.querySelector('#projects')
      const msg = document.createElement('div')
      msg.classList.add('success')
      const p = document.createElement('p')
      const txt = document.createTextNode('C\'est noté !')
      p.appendChild(txt)
      msg.appendChild(p)
      projects.appendChild(msg)
      p.classList.add('bounceIn')
    }
  }

  return app
}

storage.get('projects', function(data) {
  projectsReporter().init(data.projects)
})

var optionsLink = document.querySelector(".js-options");
optionsLink.addEventListener("click", function(e) {
  e.preventDefault();
  ext.tabs.create({'url': ext.extension.getURL('options.html')});
})
