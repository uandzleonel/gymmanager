const currentPage = location.pathname;
const items = document.querySelectorAll('header .links a');

for(item of items){
  if(currentPage.includes(item.getAttribute('href')))
    item.classList.add('active');
}

const confirmDelete = message => {
  return confirm(message);
}

const formDeleteInstructor = document.querySelector('#delete-instructor');
if ( formDeleteInstructor !== null ) {
  formDeleteInstructor.addEventListener('submit', event => {
    if( !confirmDelete('Realmente deseja excluir esse instrutor?') )
      event.preventDefault();
  })
}

const formDeleteMember = document.querySelector('#delete-member');
if ( formDeleteMember !== null ) {
  formDeleteMember.addEventListener('submit', event => {
  if( !confirmDelete('Realmente deseja excluir esse membro?') )
    event.preventDefault();
  })
}

const paginate = (selectedPage, totalPages) => {
  let oldPage, pages = [];

  for(let currentPage = 1; currentPage <= totalPages; currentPage++){
    const firstAndLastPage = currentPage == 1 || currentPage == totalPages;
    const pagesAfterSelectedPage = currentPage <= selectedPage + 2;
    const pagesBeforeSelectedPage = currentPage >= selectedPage - 2;

    if( firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage ){
      if( oldPage && currentPage - oldPage > 2 )
        pages.push("...");

      if ( oldPage && currentPage - oldPage == 2 )
        pages.push(oldPage + 1);

      pages.push(currentPage);
      oldPage = currentPage;
    }
  }
  return pages;
}

const pagination = document.querySelector('.pagination');

if( pagination ) {
  const page = +pagination.dataset.page;
  const total = +pagination.dataset.total;
  const filter = pagination.dataset.filter;
  const pages = paginate(page, total);
  let elements = '';

  pages.forEach(page => {
    if( String(page).includes('...') )
      elements += `<span>${page}</span>`
    else
      elements += `<a href='?filter=${filter}&page=${page}'>${page}</a>`
  });

  pagination.innerHTML = elements;
}
