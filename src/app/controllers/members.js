const fs = require('fs');
const { age, date } = require('../../lib/utils');

module.exports = {
  index(request, response) {
    return response.render('members/index');
  },

  create(request, response) {
    return response.render('members/create');
  },

  post(request, response) {
    const keys = Object.keys(request.body);
  
    for (key of keys) {
      if (request.body[key] == "")
        return response.render('error', {
          message: 'Todos os campos devem ser preenchidos.'
        });
    }
  },

  show (request, response) {
    const { id } = request.params;
    const createdAt = Date.now();

    return response.render('members/show');
  },

  edit(request, response) {
    const { id } = request.params;

    return response.render('members/edit');
  },

  put(request, response) {
    const { id } = request.body;
    let index = -1;

    return response.redirect(`members/${id}`);
  },

  delete(request, response) {
    const { id } = request.body;

    return response.redirect(`members`);
  }
}

//return response.render('error', {
//  message: 'Erro ao gravar.'
//});
