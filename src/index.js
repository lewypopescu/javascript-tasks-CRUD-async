import axios from 'axios';
import Notiflix from 'notiflix';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');

let searchQuery = '';
let page = 1;
const perPage = 40;

form.addEventListener('submit', onSearch);

async function onSearch(event) {
  event.preventDefault();
  searchQuery = event.currentTarget.elements.searchQuery.value.trim();
  page = 1;
  gallery.innerHTML = '';

  if (searchQuery === '') {
    return Notiflix.Notify.failure('Please enter a search query.');
  }

  fetchImages();
}

async function fetchImages() {
  const API_KEY = '43911097-2767f3575ad906659ba392cfc';
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  try {
    const response = await axios.get(URL);
    const { hits, total, totalHits } = response.data;

    if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

    renderGallery(hits);

    const lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();
  } catch (error) {
    console.error(error);
  }
}

function renderGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
    <div class="photo-card">
      <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${likes}</p>
        <p class="info-item"><b>Views:</b> ${views}</p>
        <p class="info-item"><b>Comments:</b> ${comments}</p>
        <p class="info-item"><b>Downloads:</b> ${downloads}</p>
      </div>
    </div>
  `
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

async function fetchImagesScroll() {
  const API_KEY = '43911097-2767f3575ad906659ba392cfc';
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  try {
    const response = await axios.get(URL);
    const { hits, total, totalHits } = response.data;

    renderGallery(hits);

    page += 1;
    const lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();
  } catch (error) {
    console.error(error);
  }
}

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 200) {
    fetchImagesScroll();
  }

  if (scrollTop + clientHeight === scrollHeight) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results"
    );
  }
});
