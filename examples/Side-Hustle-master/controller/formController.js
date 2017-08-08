'use strict';

const Form = require('./../model/formModel');

const formController = {

  createForm(req, res) {
    let form = new Form({
      title: req.body.title,
      description: req.body.description,
      address: req.body.address,
      pay: req.body.pay,
    })
    form.save(function(err, doc) {
      if (err) {
        res.sendStatus(400);
      } else {
        res.send(doc);
      }
    })
  },

  pullData(req, res) {
    Form.find({}, ((err, result) => {
      if (err) return err;
      res.json(result);
    }));
  }
}

module.exports = formController;
