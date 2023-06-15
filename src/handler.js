/* eslint-disable linebreak-style */
const { nanoid } = require('nanoid');
const books = require('./books');
const { errorResponse } = require('./response');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  try {
    if (!name) {
      throw new Error('Gagal menambahkan buku. Mohon isi nama buku');
    }
    if (!year) {
      throw new Error('Gagal menambahkan buku. Mohon isi tahun terbit buku');
    }
    if (!author) {
      throw new Error('Gagal menambahkan buku. Mohon isi penulis buku');
    }
    if (!summary) {
      throw new Error('Gagal menambahkan buku. Mohon isi ringkasan buku');
    }
    if (!publisher) {
      throw new Error('Gagal menambahkan buku. Mohon isi penerbit buku');
    }

    if (readPage > pageCount) {
      throw new Error('Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount');
    }

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };

    books.push(newBook);

    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);
  } catch (error) {
    return errorResponse(h, error.message, 400);
  }
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = [...books];

  if (name) {
    filteredBooks = filteredBooks.filter(
      (book) => book.name.toLowerCase().includes(name.toLowerCase()),
    );
  }

  if (reading) {
    const isReading = reading === '1';
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
  }

  if (finished) {
    const isFinished = finished === '1';
    filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
  }

  const formattedBooks = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  if (filteredBooks.length === 0) {
    return h.response({
      status: 'success',
      message: 'Daftar buku kosong, Silahkan tambahkan buku terlebih dahulu',
      data: {
        books: formattedBooks,
      },
    }).code(200);
  }

  return h.response({
    status: 'success',
    message: 'Daftar buku berhasil didapatkan',
    data: {
      books: formattedBooks,
    },
  }).code(200);
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return errorResponse(h, 'Buku tidak ditemukan', 404);
  }

  return h.response({
    status: 'success',
    message: 'Data buku berhasil didapatkan',
    data: {
      book,
    },
  }).code(200);
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const index = books.findIndex((book) => book.id === bookId);

  try {
    if (index === -1) {
      return errorResponse(h, 'Gagal memperbarui buku. Id tidak ditemukan', 404);
    }

    if (!name) {
      throw new Error('Gagal memperbarui buku. Mohon isi nama buku');
    }
    if (!year) {
      throw new Error('Gagal menambahkan buku. Mohon isi tahun terbit buku');
    }
    if (!author) {
      throw new Error('Gagal menambahkan buku. Mohon isi penulis buku');
    }
    if (!summary) {
      throw new Error('Gagal menambahkan buku. Mohon isi ringkasan buku');
    }
    if (!publisher) {
      throw new Error('Gagal menambahkan buku. Mohon isi penerbit buku');
    }

    if (readPage > pageCount) {
      throw new Error('Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount');
    }

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt: new Date().toISOString(),
    };

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }).code(200);
  } catch (error) {
    return errorResponse(h, error.message, 400);
  }
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    return errorResponse(h, 'Buku gagal dihapus. Id tidak ditemukan', 404);
  }

  books.splice(index, 1);

  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  }).code(200);
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
