
let verb = [];

let checkedBox = []

// render
const renderItem = (e, i) => {
  let mark = ''

  
  if (e.selectVar) {
    mark = 'success'
    checkedBox.push(e.id)
  }

  let html = `<tr id="${i}" class=${mark}>
  <td class="text-center"><input type="checkbox" class="form-check-input" value="${i}" ${mark === 'success' ? 'checked' : false}></td>
  <td class="text-center">${`${e.name.slice(0, 30)}`}</td>
  <td class="text-center">${`${e.name.slice(0, 30)}`}</td>
  <td class="text-center">${`${e.value.slice(0, 30)}`}</td>`
  return html
}




// checked
const checkedInput = () => {
  $('input[type=checkbox]').click(e => {
    console.log(e.currentTarget.value)
    verb = verb.map(ele => {
      if (+ele.id === +e.currentTarget.value) {
        return {
          ...ele,
          completed: true,
          selectVar: new Date()
        }
      } else {
        return ele
      }
    })
    console.log(verb);
    init()
  })

  $('.success input[type=checkbox]').click(e => {
    console.log(e.currentTarget.value)
    verb = verb.map(ele => {
      if (+ele.id === +e.currentTarget.value) {
        return {
          ...ele,
          completed: false,
          selectVar: null
        }
      } else {
        return ele
      }
    })
    console.log(verb);
    init()
  })
}

// delete select
const delSelected = () => {
  $('#deleteSelectedVar').click(e => {
    const isConfirm = confirm(`Do you want to delete ${checkedBox.length} variable?`)
    if (isConfirm) {
      for (let i = 0; i < checkedBox.length; i++) {
        const element = checkedBox[i];
        console.log(element);
        verb = verb.map(e => {
          if (+e.id === +element) {
            return {
              ...e,
              deleted: true
            }
          } else {
            return e
          }
        })
      }
      console.log('verb', verb);
      init()
    }
  })
}

// add model
const vary = () => {
  const name = $('#val-name').val()
  const type = $('#val-type').val()
  const value = $('#val-value').val()
  let err = 0
  if (!name) {
    alert('Variable name is required')
    err += 1
  }
  
  if (!err) {
    const id = verb.length
    verb.push({
      id,
      name,
	  type,
	  value
    })
    $("#myModal").modal('hide')
    console.log(verb);
    init()
  }
}

const submit = () => {
  $("button[type='submit']").click(function () {
    vary()
    console.log('www');
    return false
  });
}

const addModel = () => {
  $('.addtask').click(e => {
    $('#val-name').val('')
    $('#val-type').val('')
    $('#val-value').val('')
    $("#myModal").modal()
  })
}


// init
const init = (data) => {
  $('tbody').empty()
  console.log(data);
  const list = data ? data : verb
  checkedBox = []
  let htmlArr = list.map((e, i) => {
    if (!e.deleted) {
      const h = renderItem(e, i)
      return h
    } else {
      console.log(e);
      return ''
    }
  })
  $('tbody').append(htmlArr)
  //deleteItem()
  checkedInput()
  if (checkedBox.length) {
    $('#deleteSelectedVar').removeAttr('disabled')
  } else {
    $('#deleteSelectedVar').attr('disabled', 'disabled')
  }
}

$(document).ready(function () {
  init()
  //overdute()
  //hidecompleted()
  delSelected()
  addModel()
  submit()
})


