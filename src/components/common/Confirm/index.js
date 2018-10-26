import Vue from 'vue'
import ClubConfirm from './App.vue'

ClubConfirm.installMessage = (title, content, btn = {
  confirmCallback: null,
  cancelCallback: null
}) => {
  let obj = {
    data: {
      title: '',
      content: '',
      showConfirm: typeof btn.showConfirm === 'boolean' ? btn.showConfirm : true,
      showCancel: typeof btn.showCancel === 'boolean' ? btn.showCancel : true,
      confirmText: typeof btn.confirmText === 'string' ? btn.confirmText : 'OK',
      cancelText: typeof btn.cancelText === 'string' ? btn.cancelText : 'Cancel'
    },
    methods: {}
  }

  if (typeof title === 'string') {
    obj.data.title = title
  }

  if (typeof content === 'string') {
    obj.data.content = content
  }

  if (btn.confirmCallback && typeof btn.confirmCallback === 'function') {
    obj.methods.confirmCallback = btn.confirmCallback
  }

  if (btn.cancelCallback && typeof btn.cancelCallback === 'function') {
    obj.methods.cancelCallback = btn.cancelCallback
  }

  let Confirm = Vue.extend(ClubConfirm)

  let component = new Confirm(obj).$mount()
  document.querySelector('body').appendChild(component.$el)
}

export default ClubConfirm
