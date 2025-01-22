'use strict'
const bookGrid = document.querySelector('.book-grid')
const tableHeadings = ['Author: ', 'Pages: ', 'Read: ']
const addBookCard = document.querySelector('#add-book-card')
const myLibrary = []

function Book(name, author, pages, hasBeenRead){
  this.name = name
  this.author = author
  this.pages = pages
  this.hasBeenRead = hasBeenRead
  this.info = function () {
    return `Book name: ${name}, Author: ${author}, Pages: ${pages}, Has it been read: ${hasBeenRead}`
  }

  this.properties = function (){
    return [this.name, this.author, this.pages, this.hasBeenRead]
  }
}

function handleEditClick (event) {

}

function handleDeleteClick (event) {
  bookGrid.removeChild(event.target.offsetParent)
}

function handleAddClick (event) {
  const addBookContainer = event.target.parentElement
  const {offsetWidth, offsetHeight} = document.querySelector('.main-container')
  console.log(offsetWidth, offsetHeight)
  const finalCardHeight = +document.documentElement.offsetWidth / 4
  const finalCardHPos = (0.5 * offsetWidth - addBookContainer.offsetLeft) - addBookContainer.offsetWidth / 2
  const finalCardVPos = (0.5 * offsetHeight - addBookContainer.offsetTop) - finalCardHeight / 2
  document.documentElement.style.setProperty('--main-container-final-height', `${finalCardHeight}px`)
  document.documentElement.style.setProperty('--main-container-horizontal', `${finalCardHPos}px`)
  document.documentElement.style.setProperty('--main-container-vertical', `${finalCardVPos}px`)
  addBookContainer.style.animationName = 'shift'
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
  editButton.addEventListener('click', handleEditClick)
  const deleteButton = document.createElement('button')
  deleteButton.id = 'book-delete-btn'
  deleteButton.type = 'button'
  deleteButton.textContent = 'DELETE'
  deleteButton.addEventListener('click', handleDeleteClick)
  buttonContainer.append(editButton, deleteButton)
  return buttonContainer
}

const newBook = new Book('Zbabělci', 'Josef Škvorecký', 549, false)
const newBook2 = new Book('Hello', 'Some Guy', 500, false)
myLibrary.push(newBook, newBook2)

for (let book of myLibrary) {
  const emptyCard = createEmptyCard()
  const filledCard = createBookItemCard(book, emptyCard)
  document.querySelector('#add-book-card').before(filledCard)
}

addBookCard.addEventListener('click', handleAddClick)



