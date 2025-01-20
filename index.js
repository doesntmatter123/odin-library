const bookGrid = document.querySelector('.book-grid')
const tableHeadings = ['Author: ', 'Pages: ', 'Read: ']
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

const newBook = new Book('Zbabělci','Josef Škvorecký', 549, false)

function createBookItemCard(book){
  book.hasBeenRead = book.hasBeenRead ?'✅' : '❌'
  const [bookName, ...properties] = book.properties()
  const cardContainer = document.createElement('div')
  cardContainer.classList.add('book-item-card')
  const bookNameHeading = document.createElement('h3')
  bookNameHeading.textContent = bookName
  const table = document.createElement('table')
  table.createTBody()

  for(let i = 0; i < tableHeadings.length; i++){
    const row = table.insertRow()
    const th = document.createElement('th')
    th.textContent = tableHeadings[i]
    const cell = row.insertCell()
    cell.textContent = properties[i]
    console.log(cell.textContent)
    row.insertBefore(th, cell)
  }

  const buttonContainer = document.createElement('div')
  buttonContainer.classList.add('book-item-buttons')
  const editButton = document.createElement('button')
  editButton.id = 'book-edit-btn'
  editButton.textContent = 'EDIT'
  const deleteButton = document.createElement('button')
  deleteButton.id = 'book-delete-btn'
  deleteButton.textContent = 'DELETE'
  buttonContainer.append(editButton, deleteButton)
  cardContainer.append(bookNameHeading, table, buttonContainer)
  return cardContainer
}

myLibrary.push(newBook)
myLibrary.push(new Book('Hello', 'Some Guy', 500, false))
for(let book of myLibrary){
  bookGrid.append(createBookItemCard(book))
}



