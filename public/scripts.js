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
