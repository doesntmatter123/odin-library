'use strict'
const bookGrid = document.querySelector('.book-grid')
const tableHeadings = ['Author: ', 'Pages: ', 'Read: ']
const addBookCard = document.querySelector('#add-book-card')
const inputModal = document.querySelector('.input-modal')
initModal()
const myLibrary = []

function Book(name, author, pages, hasBeenRead){
  this.name = name
  this.author = author
  this.pages = pages
  this.hasBeenRead = hasBeenRead
  this.properties = function (){
    return [this.name, this.author, this.pages, this.hasBeenRead]
  }
}

// BUTTON LISTENERS
function handleEditClick (event) {
  const elementIndex = Array.from(bookGrid.children).indexOf(event.target.offsetParent)
  const book = myLibrary[elementIndex]
  book.hasBeenRead = !book.hasBeenRead
  const elementTable = event.target.offsetParent.querySelector('table')
  elementTable.rows[2].cells[1].textContent = book.hasBeenRead ? '✅' : '❌'
  event.target.textContent = `MARK AS ${book.hasBeenRead ? 'UNREAD' : 'READ'}`
  console.log(myLibrary)
}

function handleDeleteClick (event) {
  console.log(event.target.offsetParent)
  const elementIndex = Array.from(bookGrid.children).indexOf(event.target.offsetParent)
  myLibrary.splice(elementIndex, 1)
  bookGrid.removeChild(event.target.offsetParent)
}

function handleAddClick () {
  inputModal.showModal()
}

function createBookItemCard (book) {
  const cardContainer = document.createElement('div')
  cardContainer.classList.add('book-item-card')
  const bookNameHeading = document.createElement('h3')
  const table = createTable(tableHeadings)
  cardContainer.append(bookNameHeading, table)
  const buttonContainer = createCardButtonContainer(book.hasBeenRead)
  const [bookName, ...properties] = book.properties()
  bookNameHeading.textContent = bookName
  fillTable(table, properties)
  cardContainer.append(table, buttonContainer)
  return cardContainer
}

function fillTable (table, properties) {
  table.querySelectorAll('td').forEach((tableCell, i) => {
    if (typeof properties[i] === 'boolean') {
      tableCell.textContent = properties[i] ? '✅' : '❌'
    } else {
      tableCell.textContent = properties[i]
    }
  })
}


function createTable (tableHeadings) {
  const table = document.createElement('table')
  table.createTBody()
  tableHeadings.forEach((item, i) => {
    const row = table.insertRow()
    const th = document.createElement('th')
    th.textContent = tableHeadings[i]
    const cell = row.insertCell()
    row.insertBefore(th, cell)
  })

  return table
}

function createCardButtonContainer (bookRead) {
  const buttonContainer = document.createElement('div')
  buttonContainer.classList.add('book-item-buttons')
  const editButton = document.createElement('button')
  editButton.id = 'book-edit-btn'
  editButton.type = 'button'
  editButton.textContent = `MARK AS ${bookRead ? 'UNREAD' : 'READ'}`
  editButton.classList.add('action-button')
  editButton.addEventListener('click', handleEditClick)
  const deleteButton = document.createElement('button')
  deleteButton.id = 'book-delete-btn'
  deleteButton.type = 'button'
  deleteButton.textContent = 'DELETE'
  deleteButton.addEventListener('click', handleDeleteClick)
  deleteButton.classList.add('action-button')
  buttonContainer.append(editButton, deleteButton)
  return buttonContainer
}

function initModal () {
  const inputs = Array.from(inputModal.querySelectorAll('input'))
  // CANCEL BUTTON
  const cancelButton = document.querySelector('#cancel-button')
  cancelButton.addEventListener('click', () => {
    clearModalInputs()
    clearErrorPopups()
    inputModal.close()
  })
  // SUBMIT BUTTON
  const submitButton = document.querySelector('#submit-button')
  submitButton.addEventListener('click', (evt) => {
    evt.preventDefault()
    clearErrorPopups()
    const inputValues = [...inputs.values()].map(
      (input) => {return input.type === 'checkbox' ? input.checked : input.value})
    const [bookName, bookAuthor, pages, readAlready] = [...inputValues]
    const areInputsValid = inputs.reduce((acc, current) => {
      return acc && validateInput(current)
    }, true)
    if(areInputsValid){
      const newBook = new Book(bookName, bookAuthor, pages, readAlready)
      inputModal.close()
      myLibrary.push(newBook)
      const filledCard = createBookItemCard(newBook)
      document.querySelector('#add-book-card').before(filledCard)
      clearModalInputs()
      clearErrorPopups()
    }

  })

  inputModal.close()
}

function validateInput(input) {
  let message = ''
  if (input.type === 'text') {
    if (input.value.length < 1) {
      message = 'This field cannot be empty'
    } else if (input.value.length > 30) {
      message = 'Maximum allowed length is 30 characters long'
    }
  } else if (input.type === 'number') {
    let trimmedStr = input.value.replace(/^0+/, '') // Remove leading 0's
    if (trimmedStr.match(/\D/g)) {
      message = 'Only positive digits allowed'
    } else if (trimmedStr.length < 1) {
      message = 'This field cannot be empty or contain other characters than digits'
    } else if (trimmedStr.length > 4) {
      message = 'Maximum length is 4 numbers long'
    }
  }

  if (message) {
    displayError(message, input)
    return false
  }
  return true
}

function displayError (message, element) {
  const inputErrorPopup = document.createElement('span');
  const errorFieldPointer = document.createElement('div')
  errorFieldPointer.classList.add('error-field-pointer')
  inputErrorPopup.classList.add('input-error-popup')
  inputErrorPopup.appendChild(errorFieldPointer)
  inputErrorPopup.textContent = message
  element.before(inputErrorPopup)
}

function clearErrorPopups(){
  const inputWrappers = document.querySelectorAll('.input-wrapper')
  inputWrappers.forEach(wrapper => {
    const popup = wrapper.querySelector('.input-error-popup')
    if(popup){
      wrapper.removeChild(popup)
    }
  })
}

function clearModalInputs () {
  const inputs = Array.from(inputModal.querySelectorAll('input'))
  inputs.forEach(input => {
    input.value = ''
    if (input.type === 'checkbox') {
      input.checked = false
    }
  })
}

function renderBooks () {
  for (let book of myLibrary) {
    console.log(book)
    const filledCard = createBookItemCard(book)
    document.querySelector('#add-book-card').before(filledCard)
  }
}


const newBook2 = new Book('Hello', 'Some Guy', 500, false)
addBookCard.addEventListener('click', handleAddClick)
myLibrary.push(newBook2)
renderBooks()

