const { age, date } = require('../../lib/utils');
const Instructor = require('../models/Instructor');

module.exports = {
  index(request, response) {
    const { filter } = request.query;
    let { page, limit } = request.query;

    page = page || 1;
    limit = limit || 5;

    const params = {
      filter,
      limit,
      offset: limit * (page - 1)
    }

    Instructor.paginate(params, instructors => {
      for(instructor of instructors)
        instructor.services = instructor.services.toUpperCase().split(',');

      const pagination = {
        page,
        total: Math.ceil(Object.keys(instructors).length == 0 ? 0 : instructors[0].total / limit)
      }

      return response.render('instructors/index', { instructors, pagination, filter });
    })
   },

  create(request, response) {
    return response.render('instructors/create');
  },

  post(request, response) {
    const keys = Object.keys(request.body);
  
    for (key of keys) {
      if (request.body[key] == "")
        return response.render('error', {
          message: 'Todos os campos devem ser preenchidos.'
        });
    }

    Instructor.create(request.body, instructor => {
      if(!instructor){
        return response.render('alert', {
          message: 'O instrutor(a) não foi criado.'
        });
      }

      return response.redirect(`instructors/${instructor.id}`)
    })
  },

  show (request, response) {
    Instructor.find(request.params.id, instructor => {

      if(!instructor){
        return response.render('alert', {
          message: 'O instrutor(a) não foi encontrado.'
        });
      }

      instructor.age = age(instructor.birth);
      instructor.services = instructor.services.toUpperCase().split(',');
      instructor.created_at = date(instructor.created_at).format;

      return response.render('instructors/show', { instructor });
    })
  },

  edit(request, response) {
    Instructor.find(request.params.id, instructor => {

      if(!instructor){
        return response.render('alert', {
          message: 'O instrutor(a) não foi encontrado.'
        });
      }

      instructor.birth = date(instructor.birth).iso;

      return response.render('instructors/edit', { instructor });
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

    Instructor.update(request.body, () => {
      return response.redirect(`instructors/${request.body.id}`);
    })
  },

  delete(request, response) {
    Instructor.delete(request.body.id, () => {
      return response.redirect('instructors');
    })
  }
}
