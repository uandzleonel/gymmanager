const { date } = require('../../lib/utils');
const Member = require('../models/Member');

module.exports = {
  index(request, response) {
    Member.all(members => {
      return response.render('members/index', { members });
    })
   },

  create(request, response) {
    Member.instructorsSelectOptions(options => {
      return response.render('members/create', { instructorOptions: options });
    })
  },

  post(request, response) {
    const keys = Object.keys(request.body);
  
    for (key of keys) {
      if (request.body[key] == "")
        return response.render('error', {
          message: 'Todos os campos devem ser preenchidos.'
        });
    }

    Member.create(request.body, member => {
      if(!member){
        return response.render('alert', {
          message: 'O membro não foi criado.'
        });
      }

      return response.redirect(`members/${member.id}`)
    })
  },

  show (request, response) {
    Member.find(request.params.id, member => {

      if(!member){
        return response.render('alert', {
          message: 'O membro não foi encontrado.'
        });
      }

      member.age = date(member.birth).birthDay;
      member.blood = member.blood.replace('0', '-').replace('1', '+');

      return response.render('members/show', { member });
    })
  },

  edit(request, response) {
    Member.find(request.params.id, member => {

      if(!member){
        return response.render('alert', {
          message: 'O membro não foi encontrado.'
        });
      }

      member.birth = date(member.birth).iso;

      Member.instructorsSelectOptions(options => {
        return response.render('members/edit', { member, instructorOptions: options });
      });
    })
  },

  put(request, response) {
    const keys = Object.keys(request.body);
  
    for (key of keys) {
      if (request.body[key] == "")
        return response.render('error', {
          message: 'Todos os campos devem ser preenchidos.'
        });
    }

    Member.update(request.body, () => {
      return response.redirect(`members/${request.body.id}`);
    })
  },

  delete(request, response) {
    Member.delete(request.body.id, () => {
      return response.redirect('members');
    })
  }
}
