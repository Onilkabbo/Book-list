class Book {
	constructor(title, author, isbn) {
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}
}

class UI {
	addBookToList(book) {
		const list = document.getElementById('book-list');
		// create tr element
		const row = document.createElement('tr');
		// inser cols
		row.innerHTML = `
			<td>${book.title}</td>
			<td>${book.author}</td>
			<td>${book.isbn}</td>
			<td><a href="#" class="delete">x</a></td>
		`;
		list.appendChild(row);
	}
	showAlert(message, className) {
		// create div
		const div = document.createElement('div');
		div.style.textAlign = 'center';
		// add classes
		div.className = `alert ${className}`;
		// add text
		div.appendChild(document.createTextNode(message));
		// get parent
		const container = document.querySelector('.container');
		// get form
		const form = document.querySelector('#book-form');
		// insert alert
		container.insertBefore(div, form);
		// hide div after 2 seconds
		setTimeout(function(){
			document.querySelector('.alert').remove();
		}, 2000);
	}
	clearFields() {
		document.getElementById('title').value = '';
		document.getElementById('author').value = '';
	    document.getElementById('isbn').value = '';
	}
	deleteBook(target) {
		if(target.className === 'delete') {
			target.parentElement.parentElement.remove();
		}
	}
}

// Local storage class
class Store {
	static getBooks() {
		let books;
		if(localStorage.getItem('books') === null) {
			books = [];
		} else {
			books = JSON.parse(localStorage.getItem('books'));
		}
		return books;
	}

	static displaBooks() {
		const books = Store.getBooks();
		books.forEach(function(book){
			const ui = new UI();
			// add book to UI
			ui.addBookToList(book);
		});
	}

	static addBooks(book) {
		const books = Store.getBooks();
		books.push(book);
		localStorage.setItem('books', JSON.stringify(books));
	}

	static removeBooks(isbn) {
		const books = Store.getBooks();
		books.forEach(function(book, index) {
			if(book.isbn === isbn) {
				books.splice(index, 1);
			}
		});
		localStorage.setItem('books', JSON.stringify(books));

	}
}

//DOM load Event
document.addEventListener('DOMContentLoaded', Store.displaBooks);

//event listeners
document.getElementById('book-form').addEventListener('submit', function(e){
	e.preventDefault();
	const title = document.getElementById('title').value,
		  author = document.getElementById('author').value,
		  isbn = document.getElementById('isbn').value;

	// Instance book
	const book = new Book(title, author, isbn);
	
	// Instance UI
	const ui = new UI();
	// validate
	if(title === '' || author === '' || isbn === '') {
		// error alert
		ui.showAlert('Please fill in all fields', 'error');
	} else {
		// UI add to list
		ui.addBookToList(book);

		// add to local storage
		Store.addBooks(book);

		// show success
		ui.showAlert('Book Added! :)', 'success');

		// UI clear fields
		ui.clearFields();
	}
});

// event listener for delete
document.getElementById('book-list').addEventListener('click', function(e) {
	e.preventDefault();
	// Instance UI
	const ui = new UI();
	ui.deleteBook(e.target);
	// remove from local storage
	Store.removeBooks(e.target.parentElement.previousElementSibling.textContent);

	ui.showAlert('Book Removed.', 'success');
});