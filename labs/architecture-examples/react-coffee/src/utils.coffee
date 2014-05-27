
class Utils
  @uuid: ->
    uuid = ''
    for i in [0 ... 32]
      random = Math.random() * 16 | 0
      if i == 8 or i == 12 or i == 16 or i == 20
        uuid += '-'
      uuid +=
        if i==12
          4
        else
          if i == 16
            random & 3 | 8
          else
            random
    uuid

  @pluralize: (count, word) ->
    if count == 1 then word else (word + 's')

  @store: (namespace, data) ->
    if data
      localStorage.setItem(namespace, JSON.stringify(data))
    else
      store = localStorage.getItem(namespace)
      (store and JSON.parse(store)) or []


  @extend: ()->
    newObj = {}
    for argument in arguments
      for own key,value of argument
        newObj[key] = value
    newObj

module.exports=Utils
