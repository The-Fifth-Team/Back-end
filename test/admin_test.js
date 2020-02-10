const assert = require('assert');
const Admin = require('../Models/Admin.js');

describe ("Admin CRUD operations" , () => {

  it("Create a Admin", (done) => {
    const testObject = {firstName:"Abobker", lastName:"Abobker", password:"Abobker", email:"Abobker@gmail.com"};
    Admin.createAdmin(testObject).then(data => {
      assert(!!data);
      done();
    }).catch(err => {
      assert(false, err);
      done();
    })
  });
});


describe("", () => {

    beforeEach((done) => {
        const testObject = {firstName:"Abobker", lastName:"Abobker", password:"Abobker", email:"Abobker@gmail.com"};
        Admin.createAdmin(testObject).then(data => {
            assert(!!data);
            done();
        }).catch(err => {
            assert(false, err);
            done();
        })
    });


    it("findOneByIdAndUpdate", (done) => {
        Admin.findOneAdmin({email:"Abobker@gmail.com"}).then(data => {
            Admin.findOneByIdAndUpdate(data._id.toString(),{firstName:"Aboubakr"}).then(data => {
                assert(!!data);
                done();
            })
        }).catch(err => {
            assert(false, err);
            done();
        })
    });



    it("findOneAndUpdate", (done) => {
        Admin.findOneAndUpdate({email:"Abobker@gmail.com"}, {firstName:"Aboubaker"}).then(data => {
            assert(!!data);
            done();
        }).catch(err => {
            assert(false, err);
            done();
        })
    });

    it("findOneAdmin", (done) => {
        Admin.findOneAdmin({email:"Abobker@gmail.com"}).then(data => {
            assert(!!data);
            done();
        }).catch(err => {
            assert(false, err);
            done();
        })
    });

    it("findByIdAdmin", (done) => {
        Admin.findOneAdmin({email:"Abobker@gmail.com"}).then(data => {
            Admin.findByIdAdmin(data._id.toString()).then(data => {
                assert(!!data);
                done();
            })
        }).catch(err => {
            assert(false, err);
            done();
        })
    });

  it("findOneByIdAndRemove", (done) => {
    Admin.findOneAdmin({email:"Abobker@gmail.com"}).then(data => {
      Admin.findOneByIdAndRemove(data._id.toString()).then(data => {
        assert(!!data);
        done();
      })
    }).catch(err => {
      assert(false, err);
      done();
    })
  })
});
