class MyEventListener {
    constructor() {
      this.listeners = {}
    }
  
    emit(eventName, ...args) {
      let derRetour;
      for (let listener in this.listeners[eventName]) {
        derRetour = this.listeners[eventName][listener](...args)
      }
      return derRetour
    }
  
    on(eventName, listener) {
      if (!this.listeners[eventName]) { this.listeners[eventName] = [] }
      this.listeners[eventName].push(listener)
    }
  
    off(eventName, listener) {
      if (!listener) { this.listeners[eventName] = undefined }
      else {
        this.listeners[eventName] = this.listeners[eventName].filter(alreadyListener => alreadyListener !== listener)
        if (this.listeners[eventName].lenght === 0) { this.listeners[eventName] = undefined }
      }
  
    }
  }
  
  module.exports =  MyEventListener;