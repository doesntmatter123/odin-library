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

}

function handleDeleteClick (event) {
  bookGrid.removeChild(event.target.offsetParent)
}

function handleAddClick () {
  inputModal.showModal()
}

function createBookItemCard (book, emptyCard) {
  book.hasBeenRead = book.hasBeenRead ? '✅' : '❌'
  const [bookName, ...properties] = book.properties()
  const bookNameHeading = emptyCard.querySelector('h3')
  bookNameHeading.textContent = bookName
  const table = emptyCard.querySelector('table')
  fillTable(table, properties)
  emptyCard.append(table, createCardButtonContainer())
  return emptyCard
}

function fillTable (table, properties) {
  table.querySelectorAll('td').forEach((tableCell, i) => {
    tableCell.textContent = properties[i]
  })
}

function createEmptyCard () {
  const cardContainer = document.createElement('div')
  cardContainer.classList.add('book-item-card')
  const bookNameHeading = document.createElement('h3')
  const table = createTable(tableHeadings)
  cardContainer.append(bookNameHeading, table)
  return cardContainer
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

function createCardButtonContainer () {
  const buttonContainer = document.createElement('div')
  buttonContainer.classList.add('book-item-buttons')
  const editButton = document.createElement('button')
  editButton.id = 'book-edit-btn'
  editButton.type = 'button'
  editButton.textContent = 'EDIT'
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
    const inputs = Array.from(inputModal.querySelectorAll('input'))
    clearModalInputs(inputs)
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
      addBookToLibrary(newBook)
      inputModal.close()
    }

  })

  inputModal.close()
}

function validateInput (input) {
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
  inputErrorPopup.classList.add('input-error-popup')
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

function clearModalInputs (inputs) {
  inputs.forEach(input => {
    input.value = ''
    if (input.type === 'checkbox') {
      input.checked = false
    }
  })
}

function renderCards(){
  for (let book of myLibrary) {
    addBookToLibrary(book)
  }
}

function addBookToLibrary(book) {
  myLibrary.push(book)
  const emptyCard = createEmptyCard()
  const filledCard = createBookItemCard(book, emptyCard)
  document.querySelector('#add-book-card').before(filledCard)
}

const newBook2 = new Book('Hello', 'Some Guy', 500, false)
myLibrary.push(newBook2)
addBookCard.addEventListener('click', handleAddClick)
renderCards()

